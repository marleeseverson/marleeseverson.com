// Renders the social-sharing preview image (public/og.png, 1200x630) from an inline SVG.
import sharp from 'sharp';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f4f0e8"/>
  <g stroke="#d9d3c6" stroke-width="2" fill="none">
    <line x1="72" y1="100" x2="1128" y2="100"/>
    <line x1="72" y1="530" x2="1128" y2="530"/>
  </g>
  <text x="72" y="84" font-family="monospace" font-size="22" fill="#5c5852" letter-spacing="2">MARLEE SEVERSON — GAME PROGRAMMER</text>
  <g transform="translate(1092 62)">
    <polygon points="0,-26 22,18 -22,18" fill="none" stroke="#d9481c" stroke-width="4" stroke-linejoin="round"/>
    <circle cx="0" cy="4" r="4" fill="#d9481c"/>
  </g>
  <text x="72" y="262" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="84" fill="#141311">I write the code</text>
  <text x="72" y="354" font-family="Helvetica, Arial, sans-serif" font-weight="700" font-size="84" fill="#141311">underneath the boss fight.</text>
  <text x="72" y="440" font-family="monospace" font-size="24" fill="#5c5852">Unity · C# · roblox-ts · gameplay systems · enemy AI · client-server</text>
  <text x="72" y="574" font-family="monospace" font-size="22" fill="#5c5852">SGX AUDIENCE CHOICE · 1ST OVERALL, MINI JAM 220 · marleeseverson.com</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('public/og.png');
console.log('wrote public/og.png');
