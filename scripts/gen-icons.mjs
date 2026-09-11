import fs from 'fs';
import path from 'path';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0f19" />
      <stop offset="100%" stop-color="#172554" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde047" />
      <stop offset="50%" stop-color="#eab308" />
      <stop offset="100%" stop-color="#ca8a04" />
    </linearGradient>
    <linearGradient id="lineGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#ccff00" />
    </linearGradient>
  </defs>
  
  <rect width="512" height="512" rx="120" fill="url(#bgGrad)" />
  <rect width="500" height="500" x="6" y="6" rx="114" fill="none" stroke="#1e293b" stroke-width="4" />

  <circle cx="256" cy="220" r="140" fill="none" stroke="#334155" stroke-width="3" stroke-dasharray="8 8" opacity="0.6"/>
  <circle cx="256" cy="220" r="95" fill="none" stroke="#38bdf8" stroke-width="3" opacity="0.4"/>
  <circle cx="256" cy="220" r="50" fill="none" stroke="#e2e8f0" stroke-width="2" opacity="0.3"/>

  <path d="M 80 390 Q 200 370 290 230 T 430 110" fill="none" stroke="url(#lineGrad)" stroke-width="12" stroke-linecap="round"/>
  
  <circle cx="120" cy="382" r="8" fill="#38bdf8" />
  <circle cx="230" cy="320" r="10" fill="#38bdf8" />
  <circle cx="330" cy="180" r="12" fill="#ccff00" />
  <circle cx="430" cy="110" r="16" fill="#ccff00" stroke="#ffffff" stroke-width="4" />

  <g transform="translate(196, 150) scale(0.24)">
    <path d="M 256 0 L 100 60 L 100 240 C 100 380 256 460 256 460 C 256 460 412 380 412 240 L 412 60 Z" fill="url(#goldGrad)" stroke="#fef08a" stroke-width="12"/>
    <path d="M 170 120 L 342 120 L 320 280 C 300 330 256 350 256 350 C 256 350 212 330 192 280 Z" fill="#0f172a" opacity="0.25"/>
    <polygon points="256,150 270,195 316,195 279,222 293,266 256,240 219,266 233,222 196,195 242,195" fill="#ffffff" />
  </g>

  <rect x="186" y="420" width="140" height="36" rx="18" fill="#ccff00" />
  <text x="256" y="444" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="900" fill="#0b0f19" text-anchor="middle" letter-spacing="3">PRO</text>
</svg>`;

const iconDir = path.resolve('public/icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}
fs.writeFileSync(path.join(iconDir, 'icon-512.svg'), svg);
fs.writeFileSync(path.join(iconDir, 'icon-192.svg'), svg);
fs.writeFileSync(path.join('public', 'apple-touch-icon.png'), svg);
console.log('New Goal Tracker icon generated');
