import manifest from '@/data/media-manifest.json';

type Entry = { widths: number[]; width: number; height: number };
const entries = manifest as Record<string, Entry>;

export interface ImageSource {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

/** Resolves a manifest key (e.g. 'crystal-cavern/pickaxe-timing') to a src/srcSet pair. */
export function imageSource(id: string): ImageSource | null {
  const entry = entries[id];
  if (!entry) return null;
  const widths = [...entry.widths].sort((a, b) => a - b);
  const largest = widths[widths.length - 1];
  return {
    src: `/media/${id}-${largest}.webp`,
    srcSet: widths.map((w) => `/media/${id}-${w}.webp ${w}w`).join(', '),
    width: entry.width,
    height: entry.height,
  };
}
