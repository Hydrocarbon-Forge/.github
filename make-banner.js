// Builds profile/banner.svg: node make-banner.js
const fs = require('fs');
const path = require('path');
const S = require(path.join(__dirname, '..', 'claude-buddy', 'sprite.js'));
const W = 1200, H = 300;
const parts = [];
const rect = (x, y, w, h, c) => parts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`);

// background + ground
parts.push(`<defs>
<linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#14141f"/><stop offset="0.55" stop-color="#2a1c1a"/><stop offset="1" stop-color="#7a3b1c"/></linearGradient>
<radialGradient id="glow" cx="0.83" cy="0.75" r="0.45"><stop offset="0" stop-color="#ff9a3c" stop-opacity="0.55"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="url(#sky)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>`);
// stars / sparks
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
for (let i = 0; i < 60; i++) { const x = Math.floor(rnd() * W), y = Math.floor(rnd() * 150); const s = rnd() < 0.2 ? 4 : 2; rect(x, y, s, s, rnd() < 0.5 ? '#ffd08a' : '#ffffff33'); }
rect(0, 262, W, 38, '#1a1210'); rect(0, 262, W, 4, '#3a2418');

// the buddy, waving, at the left
const s = 10, ox = 90, oy = 262 - S.FEET * s;
parts.push(`<ellipse cx="${ox + 8 * s}" cy="262" rx="${6 * s}" ry="${1.2 * s}" fill="#000" opacity="0.35"/>`);
S.drawBuddy((x, y, w, h, c) => rect(ox + x * s, oy + y * s, w * s, h * s, c), { pose: 'wave', frame: 1, hat: 'none' });

// pixel oil drop
const drop = ['....##....', '...####...', '..######..', '.########.', '##########', '##########', '#####..###', '.########.', '..######..'];
const dx = 930, dy = 120, ds = 8;
drop.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '#') rect(dx + i * ds, dy + j * ds, ds, ds, '#1d1d24'); else if (ch === '.' && j === 6) rect(dx + i * ds, dy + j * ds, ds, ds, '#5a5a6e'); }));
rect(dx + 2 * ds, dy + 4 * ds, ds, ds * 2, '#5a5a6e');

// pixel forge flame on an anvil
const fx = 1040, fy = 140, fs2 = 8;
const flame = ['...#....', '..##..#.', '..###.#.', '.######.', '.##oo##.', '##oooo##', '##oyyo##', '.#oyyo#.'];
flame.forEach((row, j) => [...row].forEach((ch, i) => { const c = ch === '#' ? '#e8552a' : ch === 'o' ? '#ff9a3c' : ch === 'y' ? '#ffe08a' : null; if (c) rect(fx + i * fs2, fy + j * fs2, fs2, fs2, c); }));
rect(fx - 24, 206, 112, 16, '#3b3b46'); rect(fx - 8, 222, 80, 12, '#2b2b34'); rect(fx + 8, 234, 48, 28, '#2b2b34'); rect(fx - 24, 206, 112, 4, '#5a5a6e');

// title
parts.push(`<text x="300" y="150" font-family="'Press Start 2P','Courier New',ui-monospace,monospace" font-size="54" font-weight="700" fill="#fff4e8" textLength="580" lengthAdjust="spacingAndGlyphs">HYDROCARBON FORGE</text>`);
parts.push(`<text x="302" y="198" font-family="-apple-system,'Segoe UI',Helvetica,Arial,sans-serif" font-size="24" fill="#f2c9a5" textLength="520" lengthAdjust="spacingAndGlyphs">Games, mods and tiny tools, forged with Claude.</text>`);

fs.writeFileSync(path.join(__dirname, 'profile', 'banner.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">\n${parts.join('\n')}\n</svg>\n`);
console.log('wrote profile/banner.svg');
