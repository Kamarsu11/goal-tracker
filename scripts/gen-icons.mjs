import fs from 'fs';
import path from 'path';

// Generate vibrant Golden Championship Goal Cup SVG Icon
const cupSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0f19" />
      <stop offset="50%" stop-color="#111827" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>

    <!-- Gold Trophy Gradients -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffbeb" />
      <stop offset="25%" stop-color="#fde047" />
      <stop offset="60%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>

    <linearGradient id="goldDark" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ca8a04" />
      <stop offset="100%" stop-color="#854d0e" />
    </linearGradient>

    <!-- Glow Effect -->
    <radialGradient id="cupGlow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#fde047" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>
  
  <!-- Outer Rounded App Icon Tile -->
  <rect width="512" height="512" rx="115" fill="url(#bgGrad)" />
  <rect width="502" height="502" x="5" y="5" rx="110" fill="none" stroke="#334155" stroke-width="4" opacity="0.6" />

  <!-- Ambient Golden Glow -->
  <circle cx="256" cy="220" r="190" fill="url(#cupGlow)" />

  <!-- Championship Cup / Trophy -->
  <g id="trophyGroup">
    <!-- Left Handle -->
    <path d="M 170 145 C 90 145 70 260 165 285 L 180 255 C 115 235 125 175 175 175 Z" fill="url(#goldGrad)" stroke="#a16207" stroke-width="3"/>

    <!-- Right Handle -->
    <path d="M 342 145 C 422 145 442 260 347 285 L 332 255 C 397 235 387 175 337 175 Z" fill="url(#goldGrad)" stroke="#a16207" stroke-width="3"/>

    <!-- Cup Bowl (Main Body) -->
    <path d="M 155 120 L 357 120 C 357 120 365 240 310 300 C 275 338 237 338 202 300 C 147 240 155 120 155 120 Z" fill="url(#goldGrad)" stroke="#a16207" stroke-width="4"/>

    <!-- Cup Rim & Top Opening -->
    <ellipse cx="256" cy="120" rx="101" ry="22" fill="#fef08a" stroke="#ca8a04" stroke-width="4"/>
    <ellipse cx="256" cy="120" rx="85" ry="15" fill="#713f12" />

    <!-- Trophy Stem / Pedestal Connector -->
    <path d="M 236 325 L 276 325 L 282 390 L 230 390 Z" fill="url(#goldDark)" stroke="#713f12" stroke-width="3"/>

    <!-- Trophy Base (Multi-tier Pedestal) -->
    <rect x="176" y="390" width="160" height="24" rx="8" fill="url(#goldGrad)" stroke="#854d0e" stroke-width="3"/>
    <rect x="156" y="414" width="200" height="34" rx="10" fill="#0f172a" stroke="#ca8a04" stroke-width="4"/>

    <!-- Gold Plate on Base with "PRO" text -->
    <rect x="206" y="422" width="100" height="18" rx="5" fill="#ccff00" />
    <text x="256" y="436" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="900" fill="#0b0f19" text-anchor="middle" letter-spacing="2">PRO</text>

    <!-- Star Emblem on Cup Face -->
    <polygon points="256,190 268,225 305,225 275,247 286,282 256,261 226,282 237,247 207,225 244,225" fill="#ffffff" stroke="#fef08a" stroke-width="2"/>
  </g>
</svg>`;

const iconDir = path.resolve('public/icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}
fs.writeFileSync(path.join(iconDir, 'icon-512.svg'), cupSvg);
fs.writeFileSync(path.join(iconDir, 'icon-192.svg'), cupSvg);
fs.writeFileSync(path.join('public', 'apple-touch-icon.png'), cupSvg);
fs.writeFileSync(path.join('public', 'favicon.svg'), cupSvg);
console.log('Championship Goal Cup icons generated successfully!');
