import type { KeyboardEvent } from 'react'
import { regions, type Region } from '../data/regions'
import { UZ_HEIGHT, UZ_WIDTH, projectLonLat, regionPaths } from '../data/uzGeo'
import { useI18n } from '../i18n'

/** Orol dengizi qoldig‘i — shimoliy Qoraqalpog‘iston (taxminiy, 2020-yillar) */
const ARAL: [number, number][] = [
  [58.12, 45.32],
  [58.55, 45.5],
  [59.15, 45.48],
  [59.62, 45.28],
  [59.78, 44.95],
  [59.55, 44.55],
  [59.05, 44.32],
  [58.48, 44.28],
  [58.12, 44.58],
]

const toPath = (ring: [number, number][]) =>
  ring
    .map(([lon, lat], i) => {
      const [x, y] = projectLonLat(lon, lat)
      return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ') + ' Z'

const aralPath = toPath(ARAL)

const DRAW_ORDER = [
  'qoraqalpogiston',
  'xorazm',
  'navoiy',
  'buxoro',
  'qashqadaryo',
  'surxondaryo',
  'samarqand',
  'jizzax',
  'sirdaryo',
  'toshkent-viloyati',
  'namangan',
  'fargona',
  'andijon',
  'toshkent-shahri',
]

const labelBelow = new Set(['buxoro', 'fargona', 'xorazm', 'surxondaryo', 'toshkent-viloyati', 'sirdaryo', 'qashqadaryo'])
const labelRight = new Set(['samarqand', 'andijon'])
const labelLeft = new Set(['namangan'])

interface UzMapProps {
  active?: string
  onSelect?: (slug: string) => void
  labels?: string[]
  highlight?: string[]
  labelSize?: number
  className?: string
}

export function UzMap({
  active,
  onSelect,
  labels = [],
  highlight,
  labelSize = 20,
  className = '',
}: UzMapProps) {
  const { l, t } = useI18n()
  const interactive = Boolean(onSelect)

  const regionBySlug = (slug: string) => regions.find((r) => r.slug === slug)

  const pin = (r: Region) => {
    const [x, y] = projectLonLat(r.lon, r.lat)
    const isActive = active === r.slug
    const dim = highlight && !highlight.includes(r.slug)
    const showLabel = isActive || labels.includes(r.slug)
    const name = l(r.center)
    const dx = labelRight.has(r.slug)
      ? name.length * labelSize * 0.31 + labelSize * 1.9
      : labelLeft.has(r.slug)
        ? -(name.length * labelSize * 0.31 + labelSize * 1.9)
        : 0
    const dy = labelRight.has(r.slug) || labelLeft.has(r.slug)
      ? labelSize * 0.1
      : labelBelow.has(r.slug)
        ? labelSize * 1.7
        : -labelSize * 1.4

    return (
      <g
        key={`pin-${r.slug}`}
        className={`uzmap__pin${isActive ? ' is-active' : ''}${dim ? ' is-dim' : ''}`}
        transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
        pointerEvents="none"
      >
        <circle className="uzmap__halo" r={isActive ? 14 : 9} />
        <circle className="uzmap__dot" r={isActive ? 5.5 : 4} />
        {showLabel && (
          <g className="uzmap__label" transform={`translate(${dx} ${dy})`}>
            <rect
              x={-(name.length * labelSize * 0.31 + labelSize * 0.85)}
              y={-labelSize}
              width={name.length * labelSize * 0.62 + labelSize * 1.7}
              height={labelSize * 1.85}
              rx={labelSize * 0.92}
            />
            <text textAnchor="middle" y={labelSize * 0.34} fontSize={labelSize}>
              {name}
            </text>
          </g>
        )}
      </g>
    )
  }

  const regionEl = (slug: string) => {
    const d = regionPaths[slug]
    const r = regionBySlug(slug)
    if (!d || !r) return null
    const isActive = active === slug
    const dim = highlight && !highlight.includes(slug)
    const name = l(r.name)
    return (
      <path
        key={slug}
        d={d}
        className={`uzmap__region${isActive ? ' is-active' : ''}${dim ? ' is-dim' : ''}${slug === 'toshkent-shahri' ? ' uzmap__region--city' : ''}`}
        {...(interactive && {
          role: 'button',
          tabIndex: 0,
          'aria-label': name,
          'aria-pressed': isActive,
          onClick: () => onSelect!(slug),
          onKeyDown: (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onSelect!(slug)
            }
          },
        })}
      >
        <title>{name}</title>
      </path>
    )
  }

  return (
    <svg
      className={`uzmap ${className}`}
      viewBox={`-28 -22 ${UZ_WIDTH + 56} ${UZ_HEIGHT + 48}`}
      role="img"
      aria-label={t('map.aria')}
    >
      <defs>
        <linearGradient id="uz-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c9def8" />
          <stop offset="1" stopColor="#8fb6e8" />
        </linearGradient>
        <linearGradient id="uz-active" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3d8dff" />
          <stop offset="1" stopColor="#1d5fd0" />
        </linearGradient>
        <linearGradient id="uz-water" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#7eb6e6" />
          <stop offset="1" stopColor="#3f86c4" />
        </linearGradient>
        <filter id="uz-shadow" x="-10%" y="-10%" width="120%" height="128%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0b3a7a" floodOpacity="0.22" />
        </filter>
      </defs>

      <g filter="url(#uz-shadow)">
        {DRAW_ORDER.map(regionEl)}
      </g>
      <path d={aralPath} className="uzmap__water" />
      {regions.filter((r) => r.slug !== active).map(pin)}
      {regions.filter((r) => r.slug === active).map(pin)}
    </svg>
  )
}
