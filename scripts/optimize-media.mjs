// Converts everything in assets-src/<project>/ into responsive WebP variants in public/media/<project>/
// and writes src/data/media-manifest.json (which widths exist + intrinsic size) for the <Picture> component.
//
// Usage: npm run media
// Drop new screenshots/GIFs/videos into assets-src/<project>/ and re-run. PNG/JPG get cropped (optional),
// resized and converted; GIF/MP4/WebM/WebP are copied through untouched.
import sharp from 'sharp';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const SRC = 'assets-src';
const OUT = path.join('public', 'media');
const MANIFEST = path.join('src', 'data', 'media-manifest.json');
const WIDTHS = [1600, 1000, 600];

// Optional per-file crops (left, top, width, height) to remove capture chrome from screenshots.
const CROPS = {
  'crystal-cavern/pickaxe-timing.png': { left: 0, top: 0, width: 1270, height: 857 },
  'through-hell-for-you/boss-encounter.png': { left: 6, top: 6, width: 1382, height: 740 },
};

const PASSTHROUGH = new Set(['.gif', '.mp4', '.webm', '.webp']);

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

const manifest = {};
const files = (await walk(SRC)).sort();
for (const file of files) {
  const rel = path.relative(SRC, file).split(path.sep).join('/');
  const ext = path.extname(rel).toLowerCase();
  const base = rel.slice(0, -ext.length);
  const outDir = path.join(OUT, path.dirname(rel));
  await fs.mkdir(outDir, { recursive: true });

  if (PASSTHROUGH.has(ext)) {
    await fs.copyFile(file, path.join(OUT, rel));
    console.log('copied  ', rel);
    continue;
  }
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

  let image = sharp(file);
  const crop = CROPS[rel];
  if (crop) image = image.extract(crop);
  const meta = await sharp(file).metadata();
  const srcWidth = crop ? crop.width : meta.width;
  const srcHeight = crop ? crop.height : meta.height;

  const produced = [];
  for (const w of WIDTHS) {
    // Skip upscaled variants, but always keep the smallest one.
    if (w > srcWidth && w !== WIDTHS[WIDTHS.length - 1]) continue;
    await image
      .clone()
      .resize({ width: Math.min(w, srcWidth), withoutEnlargement: true, kernel: 'lanczos3' })
      .webp({ quality: 84, effort: 5 })
      .toFile(path.join(OUT, `${base}-${w}.webp`));
    produced.push(w);
  }
  manifest[base] = { widths: produced, width: srcWidth, height: srcHeight };
  console.log('encoded ', rel, `(${srcWidth}x${srcHeight} source)`);
}

await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
console.log('media done →', MANIFEST);
