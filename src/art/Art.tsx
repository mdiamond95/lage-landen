import type { ArtId } from '../content/schema'

// Original flat illustrations, drawn for the app so it owns them outright.
// All share a 200 x 150 frame and the palette in styles.css.

const Sky = () => <rect width="200" height="150" fill="var(--art-sky)" />

function Windmill() {
  return (
    <g>
      <Sky />
      <rect y="112" width="200" height="38" fill="var(--art-grass)" />
      <rect y="124" width="200" height="6" fill="var(--art-water)" />
      <path d="M86 112 92 56h16l6 56z" fill="var(--art-thatch)" />
      <path d="M90 60h20l-3-10H93z" fill="var(--art-roof)" />
      <rect x="95" y="94" width="10" height="18" rx="5" fill="var(--art-ink)" />
      <g transform="translate(100 56) rotate(20)" fill="var(--art-sail)" stroke="var(--art-ink)" strokeWidth="1.5">
        <rect x="-4" y="-50" width="8" height="46" />
        <rect x="-4" y="4" width="8" height="46" />
        <rect x="-50" y="-4" width="46" height="8" />
        <rect x="4" y="-4" width="46" height="8" />
      </g>
      <circle cx="100" cy="56" r="4" fill="var(--art-ink)" />
    </g>
  )
}

function Terp() {
  return (
    <g>
      <Sky />
      <rect y="100" width="200" height="50" fill="var(--art-water)" />
      <path d="M0 108c20-2 30 2 50 0s30 2 50 0 30 2 50 0 30 2 50 0" stroke="var(--art-wave)" strokeWidth="2" fill="none" />
      <path d="M30 118C60 78 140 78 170 118z" fill="var(--art-grass)" />
      <path d="M78 92V76l22-16 22 16v16z" fill="var(--art-wall)" />
      <path d="M72 78 100 56l28 22z" fill="var(--art-thatch)" />
      <rect x="95" y="80" width="10" height="12" fill="var(--art-ink)" />
      <circle cx="140" cy="94" r="5" fill="var(--art-sail)" />
      <circle cx="56" cy="98" r="4" fill="var(--art-sail)" />
    </g>
  )
}

function Dike() {
  return (
    <g>
      <Sky />
      <path d="M0 96h52l38-34h20l40 50h50v38H0z" fill="var(--art-grass)" />
      <path d="M0 96h52l-4 4H0z" fill="var(--art-grass-dark)" />
      <path d="M0 74h58L52 96H0z" fill="var(--art-water)" />
      <path d="M0 78c10-3 18 3 28 0s18 3 28 0" stroke="var(--art-wave)" strokeWidth="2" fill="none" />
      <rect x="150" y="104" width="50" height="8" fill="var(--art-water)" opacity="0.8" />
      <ellipse cx="96" cy="58" rx="8" ry="5" fill="var(--art-sail)" />
      <circle cx="104" cy="55" r="3" fill="var(--art-ink)" />
      <text x="20" y="66" fontSize="10" fill="var(--art-ink)">sea</text>
      <text x="150" y="132" fontSize="10" fill="var(--art-ink)">land</text>
    </g>
  )
}

function Polder() {
  // Seen from above: long thin fields between straight ditches.
  const ditches = [20, 48, 76, 104, 132]
  return (
    <g>
      <rect width="200" height="150" fill="var(--art-grass)" />
      {ditches.map((y) => (
        <rect key={y} x="0" y={y} width="200" height="4" fill="var(--art-water)" />
      ))}
      <rect x="0" y="62" width="200" height="14" fill="var(--art-grass-dark)" opacity="0.5" />
      <rect x="0" y="118" width="200" height="14" fill="var(--art-thatch)" opacity="0.45" />
      <rect x="172" y="0" width="10" height="150" fill="var(--art-water)" />
      <rect x="183" y="0" width="17" height="150" fill="var(--art-grass-dark)" />
      <path d="M40 36h20v10H40z" fill="var(--art-roof)" />
    </g>
  )
}

function Barrier() {
  const piers = [16, 52, 88, 124, 160]
  return (
    <g>
      <Sky />
      <rect y="92" width="200" height="58" fill="var(--art-water)" />
      <path d="M0 100c20-3 30 3 50 0s30 3 50 0 30 3 50 0 30 3 50 0" stroke="var(--art-wave)" strokeWidth="2" fill="none" />
      <rect x="0" y="54" width="200" height="8" fill="var(--art-concrete-dark)" />
      {piers.map((x) => (
        <g key={x}>
          <rect x={x} y="40" width="22" height="80" fill="var(--art-concrete)" />
          <rect x={x + 22} y="70" width="14" height="22" fill="var(--art-gate)" />
        </g>
      ))}
    </g>
  )
}

function FlagH({ colours }: { colours: [string, string, string] }) {
  return (
    <g>
      {colours.map((c, i) => (
        <rect key={i} x="25" y={25 + i * 33.3} width="150" height="33.4" fill={c} />
      ))}
      <rect x="25" y="25" width="150" height="100" fill="none" stroke="var(--line)" />
    </g>
  )
}

function FlagV({ colours }: { colours: [string, string, string] }) {
  return (
    <g>
      {colours.map((c, i) => (
        <rect key={i} x={25 + i * 50} y="25" width="50.2" height="100" fill={c} />
      ))}
      <rect x="25" y="25" width="150" height="100" fill="none" stroke="var(--line)" />
    </g>
  )
}

// One tile that fills the plane, the trick Escher learned from the Alhambra: what bulges
// out of one side is cut out of the opposite side, so the tiles lock together.
const TILE = 'M0 0C10-10 30 10 40 0C30 10 50 30 40 40C30 50 10 30 0 40C10 30-10 10 0 0Z'
function Tessellation() {
  const tiles = []
  for (let row = 0; row < 5; row++)
    for (let col = 0; col < 6; col++)
      tiles.push(
        <path
          key={`${row}-${col}`}
          d={TILE}
          transform={`translate(${col * 40 - 20} ${row * 40 - 25})`}
          fill={(row + col) % 2 ? 'var(--art-water)' : 'var(--art-thatch)'}
          stroke="var(--art-ink)"
          strokeWidth="1.2"
        />,
      )
  return (
    <g>
      <rect width="200" height="150" fill="var(--art-sail)" />
      {tiles}
    </g>
  )
}

const pieces: Record<ArtId, { draw: () => React.ReactElement; alt: string }> = {
  windmill: { draw: Windmill, alt: 'A drainage windmill beside a ditch' },
  terp: { draw: Terp, alt: 'A farmhouse on a raised mound surrounded by water' },
  dike: { draw: Dike, alt: 'Cross-section of a dike with the sea on one side and land on the other' },
  polder: { draw: Polder, alt: 'Long narrow fields divided by straight ditches, seen from above' },
  barrier: { draw: Barrier, alt: 'A row of concrete piers with gates across open water' },
  'flag-nl': { draw: () => <FlagH colours={['#AE1C28', '#FFFFFF', '#21468B']} />, alt: 'Red, white and blue horizontal stripes' },
  'flag-lu': { draw: () => <FlagH colours={['#EA141D', '#FFFFFF', '#51ADDA']} />, alt: 'Red, white and light blue horizontal stripes' },
  'flag-de': { draw: () => <FlagH colours={['#000000', '#DD0000', '#FFCC00']} />, alt: 'Black, red and gold horizontal stripes' },
  'flag-be': { draw: () => <FlagV colours={['#000000', '#FDDA24', '#EF3340']} />, alt: 'Black, yellow and red vertical stripes' },
  tessellation: { draw: Tessellation, alt: 'Interlocking tiles of one curved shape in two colours, filling the whole picture without gaps' },
}

export function Art({ id, className }: { id: ArtId; className?: string }) {
  const piece = pieces[id]
  const Draw = piece.draw
  return (
    <svg viewBox="0 0 200 150" className={className ?? 'art'} role="img" aria-label={piece.alt}>
      <Draw />
    </svg>
  )
}
