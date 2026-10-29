/**
 * Toshkent siluyeti: tog‘lar, binolar, teleminora va O‘zbekiston bayrog‘i.
 * Taqdimotning har bir slaydida takrorlanadigan vizual motiv.
 */

// [x, kenglik, balandlik]
const far: [number, number, number][] = [
  [0, 46, 70], [40, 38, 105], [74, 52, 82], [122, 34, 128], [152, 48, 96], [196, 40, 140],
  [232, 56, 88], [284, 36, 118], [316, 50, 76], [362, 42, 132], [400, 58, 98], [454, 36, 150],
  [486, 52, 104], [534, 40, 84], [570, 48, 126], [614, 38, 92], [648, 54, 138], [698, 42, 100],
  [736, 50, 82], [864, 46, 118], [906, 40, 90], [1080, 44, 112], [1120, 50, 84], [1166, 40, 124],
]

const near: [number, number, number][] = [
  [60, 44, 120], [150, 38, 168], [250, 50, 132], [338, 34, 190], [430, 46, 150], [520, 40, 210],
  [600, 52, 162], [688, 36, 236], [732, 46, 176], [880, 42, 196], [1000, 54, 142], [1100, 40, 178],
]

function wave(x: number, y0: number, y1: number, w = 112) {
  return `M${x} ${y0} C${x + w / 3} ${y0 - 9} ${x + (2 * w) / 3} ${y0 + 9} ${x + w} ${y0} L${x + w} ${y1} C${x + (2 * w) / 3} ${y1 + 9} ${x + w / 3} ${y1 - 9} ${x} ${y1} Z`
}

export function Skyline({ className = '' }: { className?: string }) {
  const fx = 958
  const fy = 96
  return (
    <svg
      className={`skyline ${className}`}
      viewBox="0 0 1200 300"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sk-mtn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9dcfb" />
          <stop offset="1" stopColor="#e9f1ff" />
        </linearGradient>
        <linearGradient id="sk-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9c6f6" />
          <stop offset="1" stopColor="#cfe0fb" />
        </linearGradient>
        <linearGradient id="sk-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#1a4fbf" />
        </linearGradient>
        <linearGradient id="sk-tower" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d4fc4" />
          <stop offset="1" stopColor="#0b2266" />
        </linearGradient>
        <pattern id="sk-win" width="10" height="12" patternUnits="userSpaceOnUse">
          <rect x="2" y="3" width="2" height="6" fill="#fff" opacity="0.28" />
          <rect x="6" y="3" width="2" height="6" fill="#fff" opacity="0.16" />
        </pattern>
      </defs>

      {/* Tog‘lar */}
      <path
        d="M0 210 L90 150 L150 176 L240 110 L320 168 L410 126 L470 150 L560 92 L640 150 L720 118 L800 160 L880 104 L960 150 L1040 96 L1120 142 L1200 120 L1200 300 L0 300 Z"
        fill="url(#sk-mtn)"
      />
      <path
        d="M240 110 L262 124 L250 128 L232 122 Z M560 92 L584 108 L570 112 L548 106 Z M880 104 L902 118 L888 121 L870 115 Z M1040 96 L1062 110 L1048 114 L1030 108 Z"
        fill="#fff"
        opacity="0.9"
      />

      {/* Uzoqdagi binolar */}
      {far.map(([x, w, h]) => (
        <rect key={`f${x}`} x={x} y={300 - h} width={w} height={h} rx="2" fill="url(#sk-far)" />
      ))}

      {/* Yaqindagi binolar */}
      {near.map(([x, w, h]) => (
        <g key={`n${x}`}>
          <rect x={x} y={300 - h} width={w} height={h} rx="3" fill="url(#sk-near)" />
          <rect x={x} y={300 - h} width={w} height={h} rx="3" fill="url(#sk-win)" />
          <rect x={x + w / 2 - 1} y={300 - h - 10} width="2" height="10" fill="#1a4fbf" />
        </g>
      ))}

      {/* Toshkent teleminorasi */}
      <g fill="url(#sk-tower)">
        <path d="M790 300 L798 300 L818 200 L813 200 Z" />
        <path d="M850 300 L842 300 L822 200 L827 200 Z" />
        <path d="M816 300 L824 300 L823 200 L817 200 Z" />
        <rect x="798" y="262" width="44" height="3" rx="1.5" />
        <path d="M815 206 L825 206 L823 64 L817 64 Z" />
        <ellipse cx="820" cy="122" rx="22" ry="8" />
        <ellipse cx="820" cy="109" rx="15" ry="5" />
        <ellipse cx="820" cy="134" rx="13" ry="4.5" />
        <ellipse cx="820" cy="80" rx="9" ry="3.2" />
        <rect x="819" y="6" width="2" height="60" />
      </g>
      <circle cx="820" cy="6" r="2.4" fill="#e5484d" />

      {/* Bayroq */}
      <rect x={fx - 3} y={fy - 4} width="3" height={300 - fy + 4} rx="1.5" fill="#7f99c6" />
      <path d={wave(fx, fy, fy + 22)} fill="#0099b5" />
      <path d={wave(fx, fy + 22, fy + 23.6)} fill="#ce1126" />
      <path d={wave(fx, fy + 23.6, fy + 44)} fill="#ffffff" />
      <path d={wave(fx, fy + 44, fy + 45.6)} fill="#ce1126" />
      <path d={wave(fx, fy + 45.6, fy + 68)} fill="#1eb53a" />
      <circle cx={fx + 14} cy={fy + 10} r="6.2" fill="#fff" />
      <circle cx={fx + 16.4} cy={fy + 9.6} r="5.4" fill="#0099b5" />
      {[0, 1, 2].map((row) =>
        Array.from({ length: [3, 4, 5][row] }, (_, i) => (
          <circle
            key={`${row}-${i}`}
            cx={fx + 46 - i * 5.2}
            cy={fy + 5 + row * 5.4}
            r="1.1"
            fill="#fff"
          />
        )),
      )}

      {/* Daraxtlar */}
      {Array.from({ length: 40 }, (_, i) => {
        const x = i * 31 + ((i * 17) % 13)
        const r = 9 + ((i * 7) % 6)
        return <circle key={`t${i}`} cx={x} cy={300 - r / 2} r={r} fill="#8fb6f2" opacity="0.55" />
      })}
    </svg>
  )
}
