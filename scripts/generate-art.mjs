/** Original, deterministic SVG studies. No source images or external assets.
 * Run with `node scripts/generate-art.mjs` after editing.
 * Replace these studies with approved text-free artwork through the asset paths.
 */
import { mkdir, writeFile } from 'node:fs/promises';

const out = new URL('../public/art/', import.meta.url);
await mkdir(out, { recursive: true });
let seed = 71239;
const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const normal = () => Math.sqrt(-2 * Math.log(Math.max(.001, random()))) * Math.cos(2 * Math.PI * random());
const n = value => Number(value.toFixed(2));
const path = (d, stroke, width = 1, opacity = 1) => `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" opacity="${opacity}"/>`;
const dot = (x, y, r, color, opacity) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" fill="${color}" opacity="${n(opacity)}"/>`;
const defs = `<defs>
  <radialGradient id="glow"><stop stop-color="#ffd8a0"/><stop offset=".07" stop-color="#ee9a37" stop-opacity=".8"/><stop offset=".3" stop-color="#b86525" stop-opacity=".25"/><stop offset="1" stop-color="#0b0c0d" stop-opacity="0"/></radialGradient>
  <linearGradient id="fade"><stop stop-color="#0b0c0d"/><stop offset=".27" stop-color="#0b0c0d" stop-opacity=".98"/><stop offset=".55" stop-color="#0b0c0d" stop-opacity=".22"/><stop offset="1" stop-color="#0b0c0d" stop-opacity="0"/></linearGradient>
  <linearGradient id="bottom" x2="0" y2="1"><stop offset=".6" stop-color="#0b0c0d" stop-opacity="0"/><stop offset="1" stop-color="#0b0c0d"/></linearGradient>
  <filter id="mist" x="-40%" y="-30%" width="180%" height="160%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".015 .025" numOctaves="4" seed="12" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="145" xChannelSelector="R" yChannelSelector="G" result="shape"/><feGaussianBlur in="shape" stdDeviation="8" result="softShape"/><feColorMatrix in="noise" type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1.3 1.3 1.3 0 -1.55" result="texture"/><feComposite in="softShape" in2="texture" operator="in"/></filter>
  <filter id="soft"><feGaussianBlur stdDeviation="22"/></filter>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".07"/></feComponentTransfer></filter>
</defs>`;
const svg = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs}<rect width="100%" height="100%" fill="#0b0c0d"/>${body}</svg>`;
const save = (file, content) => writeFile(new URL(file, out), content);

let hero = '<ellipse cx="1270" cy="493" rx="485" ry="350" fill="url(#glow)" opacity=".78"/>';
const trail = 'M800 -140 C600 110 1010 195 885 365 S1290 575 1190 745 S1445 945 1500 1080';
hero += `<g filter="url(#mist)">${path(trail, '#8f8e88', 155, .5)}${path(trail, '#b5b0a5', 80, .7)}${path(trail, '#d0c8b6', 28, .7)}${path('M490 1100 C750 770 670 735 925 565 S1280 480 1700 210', '#c57d35', 100, .8)}</g>`;
for (let i = 0; i < 2550; i++) {
  const t = random();
  const center = 755 + t * 630 + Math.sin(t * Math.PI * 5) * 95;
  const x = center + normal() * (35 + Math.sin(t * 16) ** 2 * 60);
  const y = t * 1150 - 100 + normal() * 19;
  hero += dot(x, y, .25 + random() * 1.05, i % 4 ? '#bcb9b1' : '#df8a35', .04 + random() * .3);
}
for (let i = 0; i < 1500; i++) {
  const t = random();
  const x = 600 + t * 1100;
  const y = 1040 - t * 800 + Math.sin(t * 9) * 150 + normal() * (18 + random() * 50);
  hero += dot(x, y, .25 + random() * 1.2, '#d9903e', .05 + random() * .45);
}
for (let i = 0; i < 48; i++) {
  const offset = i * 3.6;
  hero += path(`M${n(685 + offset)} -40 C${n(1100 - offset)} ${n(100 + offset)}, ${n(760 + offset)} ${n(690 - offset)}, 1265 490 S1520 ${n(135 + offset)}, 1760 ${n(290 + offset)}`, '#a86c31', .55, .10 + (i % 4) * .025);
}
hero += path('M650 900 C790 255 1030 125 1335 365 S1565 565 1730 590', '#c79150', .9, .65);
hero += path('M630 760 C1000 75 1210 330 1720 345', '#aaa293', .6, .45);
hero += path('M1070 -60 C700 85 1570 940 1710 1010', '#aaa293', .6, .28);
hero += path('M1238 91 V282 M1176 690 V790 M1480 0 V1000', '#b6aa94', .65, .35);
hero += '<path d="M1234 278h7v7h-7z M1172 686h7v7h-7z" fill="#d99140"/>';
hero += '<ellipse cx="1265" cy="490" rx="74" ry="65" fill="url(#glow)"/>';
hero += path('M1170 490H1385 M1265 420V562', '#d89442', .65, .5);
hero += dot(1265, 490, 2.2, '#ffe2b5', .95);
hero += '<rect width="1600" height="1000" fill="url(#fade)"/><rect width="1600" height="1000" fill="url(#bottom)"/>';
await save('hero-atmosphere.svg', svg(1600, 1000, hero));

let threshold = `<radialGradient id="room"><stop stop-color="#ad7848" stop-opacity=".38"/><stop offset="1" stop-color="#1e1f21" stop-opacity="0"/></radialGradient>
<rect width="700" height="850" fill="#111314"/><ellipse cx="520" cy="410" rx="330" ry="430" fill="url(#room)"/>
<path d="M0 650L520 520 700 620V850H0Z" fill="#171819"/>
<path d="M65 220L450 345V610L65 680Z" fill="#080a0b"/>
<path d="M65 220L90 207 475 332 450 345Z" fill="#242526"/>
<path d="M450 345L475 332V604L450 610Z" fill="#34302a"/>
<path d="M560 65L700 0V685L560 615Z" fill="#0b0c0d"/>
<path d="M554 70L560 65V615L554 616Z" fill="#ffc78d"/>
<path d="M515 140L552 80V620L514 660Z" fill="#bc7325" opacity=".12" filter="url(#soft)"/>
<path d="M560 615L250 850H160Z" fill="#c58544" opacity=".09"/>
<ellipse cx="552" cy="610" rx="100" ry="260" fill="url(#glow)" opacity=".55"/>
${path('M65 680L556 615 700 685', '#d09c65', 1.1, .65)}`;
for (let i = 0; i < 10; i++) threshold += path(`M${100 + i * 36} ${232 + i * 12}V${674 - i * 7}`, '#353330', .7, .42);
for (let i = 0; i < 16; i++) threshold += path(`M0 ${650 + i * i * .85}L700 ${620 + i * i * 1.2}`, '#968573', .6, .10);
threshold += '<rect width="700" height="850" filter="url(#grain)" opacity=".5"/>';
await save('threshold.svg', svg(700, 850, threshold));

const cloud = (count, warm = true) => {
  let result = '<ellipse cx="355" cy="190" rx="290" ry="250" fill="url(#glow)" opacity=".65"/>';
  result += `<g filter="url(#mist)">${path('M60 400Q100 160 280 200T540 -50', warm ? '#c08447' : '#777d80', 130, .8)}${path('M140 420Q180 110 330 180T550 -40', '#b2a79b', 65, .7)}</g>`;
  for (let i = 0; i < count; i++) {
    const t = random();
    result += dot(80 + t * 450 + normal() * 35, 360 - t * 380 + Math.sin(t * 12) * 50 + normal() * 28, random() * 1.6 + .3, i % 4 ? '#cf8845' : '#cac1b8', random() * .6);
  }
  return result;
};
// LAB: loose particle experiment with incomplete measurement orbits.
let lab = cloud(450);
lab += '<g fill="none" stroke="#e6a357"><circle cx="335" cy="182" r="112" stroke-width=".8" stroke-dasharray="2 9" opacity=".42"/><path d="M208 216A132 132 0 0 1 378 57M451 245A132 132 0 0 1 276 300" stroke-width=".8" opacity=".65"/></g>';
lab += path('M179 182H195 M475 182H491 M335 28V44 M335 320V336', '#b1afb4', .8, .6);
await save('lab.svg', svg(600, 360, lab));
await save('cinder.svg', svg(600, 360, cloud(600, false)));

let systems = '<ellipse cx="330" cy="180" rx="320" ry="280" fill="url(#glow)" opacity=".3"/>';
const nodes = Array.from({ length: 30 }, (_, i) => ({ x: 75 + (i % 6) * 90 + random() * 25, y: 60 + Math.floor(i / 6) * 65 + random() * 30 }));
nodes.forEach((a, i) => {
  nodes.slice(i + 1).forEach(b => { if (Math.hypot(a.x - b.x, a.y - b.y) < 150) systems += path(`M${n(a.x)} ${n(a.y)}L${n(b.x)} ${n(b.y)}`, '#b5814d', .6, .45); });
  systems += dot(a.x, a.y, i % 5 ? 1.5 : 3, '#e0a260', .8);
});
// SYSTEMS: deliberate connected volumes, distinct from LAB's organic field.
let systemRooms = '<ellipse cx="300" cy="210" rx="300" ry="210" fill="url(#glow)" opacity=".17"/>';
for (const [x, y] of [[90, 185], [240, 120], [390, 185]]) {
  systemRooms += `<path d="M${x} ${y}l70 -40 70 40 -70 40z" fill="#1e1f21" fill-opacity=".65" stroke="#b1afb4" stroke-opacity=".5" stroke-width=".8"/>`;
  systemRooms += path(`M${x} ${y}v100l70 40 70 -40v-100 M${x + 70} ${y + 40}v100`, '#b1afb4', .8, .38);
  systemRooms += path(`M${x + 70} ${y - 40}v100l70 40 M${x} ${y + 100}l70 -40`, '#d97706', .7, .32);
}
systemRooms += path('M160 225V282L310 217 460 282V225', '#e6a357', 1.4, .9);
systemRooms += dot(160, 225, 2.5, '#e6a357', 1) + dot(310, 217, 2.5, '#e6a357', 1) + dot(460, 225, 2.5, '#e6a357', 1);
await save('systems.svg', svg(600, 360, systemRooms));
await save('workbench.svg', svg(600, 360, systems + '<circle cx="320" cy="185" r="120" fill="none" stroke="#b7a18a" stroke-width=".7" opacity=".65"/><circle cx="320" cy="185" r="150" fill="none" stroke="#b7a18a" stroke-width=".5" opacity=".25"/>'));

let frequencies = '';
for (let i = 0; i < 32; i++) {
  let d = '';
  for (let x = -10; x <= 610; x += 5) {
    const y = 180 + Math.sin(x / 76 + i * .11) * (50 + i * 1.5) * Math.sin((x + 50) / 650 * Math.PI) + (i - 16) * 2;
    d += `${x === -10 ? 'M' : 'L'}${x} ${n(y)}`;
  }
  frequencies += path(d, i % 5 ? '#b7783d' : '#d6c3ac', .7, .25 + (i % 5) * .1);
}
await save('frequencies.svg', svg(600, 360, frequencies));

// PERSPECTIVES: quiet, offset horizons with depth instead of a second light portal.
let perspectives = '<ellipse cx="405" cy="190" rx="280" ry="150" fill="url(#glow)" opacity=".32"/>';
perspectives += '<circle cx="405" cy="176" r="67" fill="none" stroke="#e6a357" stroke-width=".8" opacity=".5"/>';
perspectives += '<path d="M0 233L115 184 201 206 289 161 405 214 530 178 600 198V360H0Z" fill="#1e1f21"/>';
perspectives += path('M0 233L115 184 201 206 289 161 405 214 530 178 600 198', '#b1afb4', .8, .48);
perspectives += '<path d="M0 288L142 243 236 270 361 226 466 257 600 219V360H0Z" fill="#121416"/>';
perspectives += path('M0 288L142 243 236 270 361 226 466 257 600 219', '#d97706', .8, .5);
perspectives += '<path d="M0 322L183 288 290 319 425 281 600 315V360H0Z" fill="#0b0c0d"/>';
perspectives += path('M44 215H556', '#e6a357', .5, .28);
await save('perspectives.svg', svg(600, 360, perspectives));

let repeat = '<ellipse cx="300" cy="180" rx="330" ry="230" fill="url(#glow)" opacity=".35"/><g transform="translate(310 215) rotate(-18) scale(1 .56)">';
for (let r = 45; r < 260; r += 3) repeat += `<circle r="${r}" fill="none" stroke="${r % 5 ? '#5b4835' : '#b68b5d'}" stroke-width=".8" opacity="${r % 5 ? '.35' : '.7'}"/>`;
repeat += '<circle r="44" fill="#664526"/><circle r="5" fill="#111"/><path d="M0 0L-130 -230A265 265 0 0 1 100 -244Z" fill="#c89b66" opacity=".12"/></g>';
await save('repeat.svg', svg(600, 360, repeat));
console.log('Created nine original SVG studies in public/art/.');
