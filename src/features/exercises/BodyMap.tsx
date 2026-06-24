/**
 * BodyMap — a reusable muscle-map illustration (front and/or back view) for
 * exercises. The muscle group worked by the current exercise glows neon over a
 * muted deep-green body. It replaces the generic dumbbell placeholder so each
 * exercise communicates *what it works* at a glance.
 *
 * Pure presentational SVG, no state. SVG path geometry is lifted verbatim from
 * the design handoff (`BodyMap.dc.html`) — do not redraw by hand.
 */

/** Selectable muscle groups. `''` = no highlight. */
export type MuscleKey =
  | ''
  | 'chest'
  | 'shoulders'
  | 'back'
  | 'biceps'
  | 'triceps'
  | 'abs'
  | 'glutes'
  | 'quads'
  | 'hamstrings'
  | 'calves'

export type BodyView = 'both' | 'front' | 'back'

const NEON = '#494fdf' // highlighted muscle (cobalt)
const BASE = '#2c2f36' // resting muscle / forearms
const NEUTRAL = '#1f2229' // head, neck, hands, knees, feet (never highlights)
const GAP = '#16181a' // gap stroke — matches the recommended container background

/** Per-muscle intensity, 0..1. Drives the live-distribution fill. */
export type MuscleLevels = Partial<Record<Exclude<MuscleKey, ''>, number>>

const hex = (h: string): [number, number, number] => {
  const s = h.replace('#', '')
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)]
}

/** Per-channel linear interpolation between two hex colors → `rgb(...)`. */
const lerp = (a: string, b: string, t: number): string => {
  const A = hex(a)
  const B = hex(b)
  const c = A.map((x, i) => Math.round(x + (B[i] - x) * t))
  return `rgb(${c[0]},${c[1]},${c[2]})`
}

interface BodyMapProps {
  /** Which figure(s) to render. */
  view?: BodyView
  /** Primary muscle group, rendered full neon. Empty = no highlight. */
  active?: MuscleKey
  /** Secondary muscle groups (comma-separated keys), rendered at 45% neon. */
  secondary?: string
  /**
   * Intensity map. When present it OVERRIDES `active`/`secondary`: each muscle
   * is filled `lerp(BASE, NEON, level)`. Used by the live distribution map.
   */
  levels?: MuscleLevels
  /** Show a small "Front" / "Back" caption under each figure. */
  captions?: boolean
  /** Figure width in px. Height is derived: `figH = round(fw * 2.33)`. */
  fw?: number
}

export function BodyMap({
  view = 'both',
  active = '',
  secondary = '',
  levels,
  captions = false,
  fw = 112,
}: BodyMapProps) {
  const figW = fw
  const figH = Math.round(fw * 2.33)
  const secondaries = secondary
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
  /**
   * Fill for a muscle region. In `levels` mode the intensity map wins; else the
   * primary is full neon, secondaries are 45% neon, everything else rests.
   */
  const f = (k: Exclude<MuscleKey, ''>): string => {
    if (levels) {
      const t = Math.max(0, Math.min(1, levels[k] ?? 0))
      return t <= 0.001 ? BASE : lerp(BASE, NEON, t)
    }
    if (active === k) return NEON
    if (secondaries.includes(k)) return lerp(BASE, NEON, 0.45)
    return BASE
  }

  const fill = {
    delt: f('shoulders'),
    pec: f('chest'),
    biceps: f('biceps'),
    triceps: f('triceps'),
    abs: f('abs'),
    back: f('back'),
    glute: f('glutes'),
    quad: f('quads'),
    ham: f('hamstrings'),
    calf: f('calves'),
  }

  const showFront = view === 'both' || view === 'front'
  const showBack = view === 'both' || view === 'back'

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      {showFront && (
        <Figure caption={captions ? 'Front' : null}>
          <svg
            width={figW}
            height={figH}
            viewBox="0 0 200 466"
            fill="none"
            aria-label="Front view"
          >
            {/* structural */}
            <ellipse cx="100" cy="40" rx="24" ry="28" fill={NEUTRAL} />
            <path d="M86 64 C86 76 86 84 88 88 C96 93 104 93 112 88 C114 84 114 76 114 64 C104 70 96 70 86 64 Z" fill={NEUTRAL} />
            <ellipse cx="52" cy="266" rx="9" ry="11" fill={NEUTRAL} />
            <ellipse cx="148" cy="266" rx="9" ry="11" fill={NEUTRAL} />
            <path d="M80 256 C80 277 88 296 100 298 C112 296 120 277 120 256 C108 262 92 262 80 256 Z" fill={NEUTRAL} />
            <ellipse cx="84" cy="402" rx="12" ry="11" fill={NEUTRAL} />
            <ellipse cx="116" cy="402" rx="12" ry="11" fill={NEUTRAL} />
            <path d="M74 452 C71 463 80 468 92 466 C94 460 92 453 87 452 C82 450 77 450 74 452 Z" fill={NEUTRAL} />
            <path d="M126 452 C129 463 120 468 108 466 C106 460 108 453 113 452 C118 450 123 450 126 452 Z" fill={NEUTRAL} />
            {/* forearms (base) */}
            <path d="M58 190 C50 196 44 214 43 234 C42 250 46 262 54 262 C61 260 63 242 64 222 C65 206 63 196 58 190 Z" fill={BASE} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M142 190 C150 196 156 214 157 234 C158 250 154 262 146 262 C139 260 137 242 136 222 C135 206 137 196 142 190 Z" fill={BASE} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            {/* muscles */}
            <path d="M86 86 C92 84 108 84 114 86 C126 90 138 96 142 104 C120 96 80 96 58 104 C62 96 74 90 86 86 Z" fill={fill.back} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M80 94 C66 92 54 100 51 116 C49 130 55 142 66 144 C76 142 82 128 83 114 C84 104 83 98 80 94 Z" fill={fill.delt} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M120 94 C134 92 146 100 149 116 C151 130 145 142 134 144 C124 142 118 128 117 114 C116 104 117 98 120 94 Z" fill={fill.delt} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M98 100 C86 98 74 102 68 112 C62 124 64 144 74 152 C84 158 94 156 98 150 L98 100 Z" fill={fill.pec} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M102 100 C114 98 126 102 132 112 C138 124 136 144 126 152 C116 158 106 156 102 150 L102 100 Z" fill={fill.pec} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M66 102 C56 106 49 120 48 140 C47 160 50 178 58 188 C66 184 70 166 71 146 C72 128 71 112 66 102 Z" fill={fill.biceps} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M134 102 C144 106 151 120 152 140 C153 160 150 178 142 188 C134 184 130 166 129 146 C128 128 129 112 134 102 Z" fill={fill.biceps} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M86 156 C82 178 82 212 86 242 C90 254 100 260 100 260 C100 260 110 254 114 242 C118 212 118 178 114 156 C104 152 96 152 86 156 Z" fill={fill.abs} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M98 300 C86 298 76 308 72 330 C69 352 71 380 80 394 C88 400 96 398 98 392 C99 360 99 330 98 300 Z" fill={fill.quad} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M102 300 C114 298 124 308 128 330 C131 352 129 380 120 394 C112 400 104 398 102 392 C101 360 101 330 102 300 Z" fill={fill.quad} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M96 412 C88 414 82 428 80 442 C79 452 84 456 92 456 C95 452 96 438 96 412 Z" fill={fill.calf} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M104 412 C112 414 118 428 120 442 C121 452 116 456 108 456 C105 452 104 438 104 412 Z" fill={fill.calf} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            {/* striations */}
            <g stroke={GAP} strokeWidth="2.1" strokeLinecap="round" fill="none" opacity=".85">
              <path d="M100 160 L100 256" />
              <path d="M88 186 L112 186" />
              <path d="M87 208 L113 208" />
              <path d="M88 230 L112 230" />
              <path d="M89 310 C85 342 87 372 91 390" />
              <path d="M111 310 C115 342 113 372 109 390" />
            </g>
          </svg>
        </Figure>
      )}

      {showBack && (
        <Figure caption={captions ? 'Back' : null}>
          <svg
            width={figW}
            height={figH}
            viewBox="0 0 200 466"
            fill="none"
            aria-label="Back view"
          >
            {/* structural */}
            <ellipse cx="100" cy="40" rx="24" ry="28" fill={NEUTRAL} />
            <path d="M86 64 C86 76 86 84 88 88 C96 93 104 93 112 88 C114 84 114 76 114 64 C104 70 96 70 86 64 Z" fill={NEUTRAL} />
            <ellipse cx="52" cy="266" rx="9" ry="11" fill={NEUTRAL} />
            <ellipse cx="148" cy="266" rx="9" ry="11" fill={NEUTRAL} />
            <ellipse cx="84" cy="402" rx="12" ry="11" fill={NEUTRAL} />
            <ellipse cx="116" cy="402" rx="12" ry="11" fill={NEUTRAL} />
            <path d="M74 452 C71 463 80 468 92 466 C94 460 92 453 87 452 C82 450 77 450 74 452 Z" fill={NEUTRAL} />
            <path d="M126 452 C129 463 120 468 108 466 C106 460 108 453 113 452 C118 450 123 450 126 452 Z" fill={NEUTRAL} />
            {/* forearms (base) */}
            <path d="M58 190 C50 196 44 214 43 234 C42 250 46 262 54 262 C61 260 63 242 64 222 C65 206 63 196 58 190 Z" fill={BASE} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M142 190 C150 196 156 214 157 234 C158 250 154 262 146 262 C139 260 137 242 136 222 C135 206 137 196 142 190 Z" fill={BASE} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            {/* muscles */}
            <path d="M88 84 C94 82 106 82 112 84 C127 90 139 99 143 110 C133 120 119 125 100 127 C81 125 67 120 57 110 C61 99 73 90 88 84 Z" fill={fill.back} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M80 94 C66 92 54 100 51 116 C49 130 55 142 66 144 C76 142 82 128 83 114 C84 104 83 98 80 94 Z" fill={fill.delt} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M120 94 C134 92 146 100 149 116 C151 130 145 142 134 144 C124 142 118 128 117 114 C116 104 117 98 120 94 Z" fill={fill.delt} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M74 120 C66 130 64 152 70 170 C78 182 88 186 100 186 C112 186 122 182 130 170 C136 152 134 130 126 120 C112 128 88 128 74 120 Z" fill={fill.back} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M86 184 C84 202 86 224 100 232 C114 224 116 202 114 184 C104 188 96 188 86 184 Z" fill={fill.back} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M66 102 C56 106 49 120 48 140 C47 160 50 178 58 188 C66 184 70 166 71 146 C72 128 71 112 66 102 Z" fill={fill.triceps} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M134 102 C144 106 151 120 152 140 C153 160 150 178 142 188 C134 184 130 166 129 146 C128 128 129 112 134 102 Z" fill={fill.triceps} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M98 236 C86 234 77 243 76 259 C75 274 84 286 98 286 L98 236 Z" fill={fill.glute} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M102 236 C114 234 123 243 124 259 C125 274 116 286 102 286 L102 236 Z" fill={fill.glute} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M98 290 C86 288 77 300 74 324 C72 350 74 378 82 392 C90 398 97 396 98 390 C99 356 99 322 98 290 Z" fill={fill.ham} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M102 290 C114 288 123 300 126 324 C128 350 126 378 118 392 C110 398 103 396 102 390 C101 356 101 322 102 290 Z" fill={fill.ham} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M96 414 C85 415 78 429 79 443 C80 453 87 458 95 455 C97 448 97 432 96 414 Z" fill={fill.calf} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M104 414 C115 415 122 429 121 443 C120 453 113 458 105 455 C103 448 103 432 104 414 Z" fill={fill.calf} stroke={GAP} strokeWidth="2.4" strokeLinejoin="round" />
            {/* striations */}
            <g stroke={GAP} strokeWidth="2.1" strokeLinecap="round" fill="none" opacity=".85">
              <path d="M100 90 L100 232" />
              <path d="M82 132 C86 142 92 148 100 150" />
              <path d="M118 132 C114 142 108 148 100 150" />
              <path d="M89 300 C86 332 88 366 91 390" />
              <path d="M111 300 C114 332 112 366 109 390" />
              <path d="M88 420 L89 452" />
              <path d="M112 420 L111 452" />
            </g>
          </svg>
        </Figure>
      )}
    </div>
  )
}

function Figure({ children, caption }: { children: React.ReactNode; caption: string | null }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {children}
      {caption && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#6E927F',
            letterSpacing: '0.04em',
          }}
        >
          {caption}
        </div>
      )}
    </div>
  )
}
