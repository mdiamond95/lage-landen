import type { ReactNode } from 'react'
import { hats, type HatId } from './hats'
import { t } from '../i18n'

// The stork, drawn for Lage Landen: white with black flight feathers and a red bill and
// legs, standing side on. Each hat is drawn with (0, 0) at the top of the head.
const INK = '#1d2433'
const BILL = '#d9480f'

const hatArt: Record<HatId, ReactNode> = {
  souwester: (
    <>
      <path d="M-9 2 Q-9 -10 0 -10 Q9 -10 9 2Z" fill="#f2c230" />
      <path d="M-16 3 Q0 -2 16 3 L18 7 Q0 2 -14 9Z" fill="#f2c230" />
      <path d="M-9 0 Q0 -3 9 0" stroke="#c99a1a" strokeWidth="1.5" fill="none" />
    </>
  ),
  galea: (
    <>
      <path d="M-10 3 Q-11 -11 0 -11 Q11 -11 10 3Z" fill="#9aa3ad" />
      <path d="M-9 -9 Q0 -24 11 -9 Q0 -15 -9 -9Z" fill="#c0392b" />
      <path d="M-10 3 L-12 8 L-7 4Z" fill="#7c858f" />
    </>
  ),
  mitre: (
    <>
      <path d="M-9 3 L-9 -8 Q-8 -16 0 -21 Q8 -16 9 -8 L9 3Z" fill="#f4ead2" stroke="#c9a227" strokeWidth="1" />
      <path d="M-9 -1 H9 M0 -19 V3" stroke="#c9a227" strokeWidth="2.5" />
    </>
  ),
  hennin: (
    <>
      <path d="M-2 -24 Q-16 -14 -22 6 Q-12 -2 -6 0Z" fill="#d9c8ec" opacity="0.9" />
      <path d="M-8 3 L-2 -24 L8 3Z" fill="#7b3fa0" />
      <path d="M-8 3 H8" stroke="#c9a227" strokeWidth="2.5" />
    </>
  ),
  morion: (
    <>
      <path d="M-14 3 Q-15 -2 -10 -2 Q-8 -14 0 -15 Q8 -14 10 -2 Q15 -2 14 3 Q0 -1 -14 3Z" fill="#b8c0c8" />
      <path d="M-6 -12 Q0 -22 6 -12" stroke="#8b929c" strokeWidth="2.5" fill="none" />
    </>
  ),
  capotain: (
    <>
      <ellipse cx="0" cy="2" rx="15" ry="3" fill="#222" />
      <path d="M-7 2 L-6 -17 L6 -17 L7 2Z" fill="#222" />
      <path d="M-7 -1 H7" stroke="#8a6d3b" strokeWidth="2" />
    </>
  ),
  bicorne: (
    <>
      <path d="M-17 2 Q0 -18 17 2 Q0 -4 -17 2Z" fill="#222" />
      <circle cx="0" cy="-5" r="3" fill="#f57c00" />
    </>
  ),
  shako: (
    <>
      <path d="M-7 3 L-6 -14 L6 -14 L7 3Z" fill="#233a6b" />
      <path d="M2 2 L13 6 L5 4Z" fill="#111" />
      <path d="M-6 -14 H6" stroke="#c9a227" strokeWidth="2" />
      <ellipse cx="0" cy="-19" rx="2.5" ry="5" fill="#fff" stroke={INK} strokeWidth="1" />
    </>
  ),
  boater: (
    <>
      <ellipse cx="0" cy="2" rx="15" ry="3" fill="#e2c27a" />
      <rect x="-8" y="-7" width="16" height="9" rx="1" fill="#e2c27a" />
      <rect x="-8" y="-3" width="16" height="3" fill="#1f4e9c" />
    </>
  ),
  tulip: (
    <>
      <path d="M-2 4 Q-4 -6 -8 -12" stroke="#2e8540" strokeWidth="2" fill="none" />
      <path d="M-3 -2 Q-12 -4 -10 -12" fill="#2e8540" />
      <path d="M-14 -12 Q-15 -22 -10 -20 L-8 -24 L-6 -20 Q-1 -22 -2 -12 Q-8 -8 -14 -12Z" fill="#f57c00" />
    </>
  ),
  hardhat: (
    <>
      <path d="M-10 2 Q-10 -12 0 -12 Q10 -12 10 2Z" fill="#f08a24" />
      <rect x="-13" y="1" width="26" height="3" rx="1.5" fill="#f08a24" />
      <path d="M0 -12 V1" stroke="#c25f00" strokeWidth="2" />
    </>
  ),
  miner: (
    <>
      <path d="M-10 3 Q-10 -12 0 -12 Q10 -12 10 3Z" fill="#3b3b3b" />
      <rect x="-12" y="2" width="24" height="3" rx="1.5" fill="#3b3b3b" />
      <circle cx="9" cy="-4" r="3.5" fill="#ffd54a" stroke="#3b3b3b" strokeWidth="1.5" />
    </>
  ),
  poppy: (
    <>
      <circle cx="-9" cy="-1" r="4.5" fill="#c8372d" />
      <circle cx="-4" cy="-4" r="4.5" fill="#c8372d" />
      <circle cx="-9" cy="-7" r="4.5" fill="#c8372d" />
      <circle cx="-14" cy="-4" r="4.5" fill="#c8372d" />
      <circle cx="-9" cy="-4" r="2.2" fill="#111" />
    </>
  ),
  calotte: (
    <>
      <path d="M-11 3 Q-12 -9 0 -9 Q12 -9 11 3Z" fill="#8a1c2b" />
      <path d="M6 2 L15 4 L8 4Z" fill="#111" />
      <circle cx="-4" cy="-4" r="1.3" fill="#c9a227" />
      <circle cx="1" cy="-5" r="1.3" fill="#c9a227" />
      <path d="M-11 1 H11" stroke="#f2c230" strokeWidth="1.5" />
    </>
  ),
  chaperon: (
    <>
      <path d="M-14 4 Q-18 -12 0 -15 Q18 -12 14 4 Q0 -1 -14 4Z" fill="#b3261e" />
      <path d="M-11 -2 Q0 -9 11 -2 M-12 -7 Q0 -14 12 -7" stroke="#7d1a14" strokeWidth="1.5" fill="none" />
    </>
  ),
  turban: (
    <>
      <path d="M-10 6 Q-18 14 -16 26 Q-12 16 -6 8Z" fill="#e8c547" />
      <path d="M-11 4 Q-13 -12 0 -13 Q12 -12 10 4 Q0 0 -11 4Z" fill="#2f5aa8" />
      <path d="M-9 -2 Q0 -8 9 -2" stroke="#e8c547" strokeWidth="2" fill="none" />
    </>
  ),
  bowler: (
    <>
      <ellipse cx="0" cy="2" rx="13" ry="2.5" fill="#222" />
      <path d="M-8 2 Q-9 -12 0 -12 Q9 -12 8 2Z" fill="#222" />
      <circle cx="16" cy="-14" r="4" fill="#7bb661" />
      <path d="M16 -18 L17 -21" stroke="#5a9446" strokeWidth="1.5" />
    </>
  ),
  paperhat: (
    <>
      <path d="M-13 3 L0 -15 L13 3Z" fill="#f1efe8" stroke="#8b929c" strokeWidth="1" />
      <path d="M-6 -2 H5 M-4 -6 H3 M-8 1 H7" stroke="#8b929c" strokeWidth="1" />
    </>
  ),
  headphones: (
    <>
      <path d="M-11 9 Q-12 -6 0 -6 Q12 -6 11 9" stroke="#333" strokeWidth="2.5" fill="none" />
      <rect x="-14" y="4" width="6" height="10" rx="3" fill="#f57c00" />
      <rect x="8" y="4" width="6" height="10" rx="3" fill="#f57c00" />
    </>
  ),
  toque: (
    <>
      <path d="M-8 3 L-8 -6 Q-15 -10 -9 -17 Q-4 -23 0 -18 Q4 -23 9 -17 Q15 -10 8 -6 L8 3Z" fill="#fff" stroke="#c4c9d2" strokeWidth="1" />
      <path d="M-8 -1 H8" stroke="#c4c9d2" strokeWidth="1" />
    </>
  ),
  jester: (
    <>
      <path d="M-9 3 Q-14 -10 -20 -10 Q-12 -14 -2 -6Z" fill="#c8372d" />
      <path d="M9 3 Q14 -10 20 -12 Q12 -14 2 -6Z" fill="#2e8540" />
      <path d="M-9 3 Q0 -12 9 3Z" fill="#f2c230" />
      <circle cx="-20" cy="-10" r="2" fill="#f2c230" />
      <circle cx="20" cy="-12" r="2" fill="#f2c230" />
    </>
  ),
  cycling: (
    <>
      <path d="M-9 3 Q-9 -9 0 -9 Q9 -9 9 3Z" fill="#fff" stroke="#c4c9d2" strokeWidth="1" />
      <path d="M-3 -9 V3 M3 -9 V3" stroke="#1f4e9c" strokeWidth="2" />
      <path d="M0 -9 V3" stroke="#c8372d" strokeWidth="2" />
      <path d="M7 1 L16 4 L8 4Z" fill="#1f4e9c" />
    </>
  ),
  propeller: (
    <>
      <path d="M-10 3 Q-10 -10 0 -10 Q10 -10 10 3Z" fill="#1f4e9c" />
      <path d="M0 -10 Q-7 -2 -10 3 L-3 3Z M0 -10 Q7 -2 10 3 L3 3Z" fill="#f2c230" />
      <path d="M0 -10 V-14" stroke="#333" strokeWidth="1.5" />
      <path d="M-8 -15 Q0 -12 8 -15 Q0 -17 -8 -15Z" fill="#c8372d" />
    </>
  ),
  mortarboard: (
    <>
      <path d="M-8 3 Q-8 -6 0 -6 Q8 -6 8 3Z" fill="#222" />
      <path d="M-16 -7 L0 -12 L16 -7 L0 -2Z" fill="#222" />
      <path d="M0 -7 L12 -5 L12 4" stroke="#f2c230" strokeWidth="1.5" fill="none" />
    </>
  ),
  prinsjesdag: (
    <>
      <ellipse cx="0" cy="2" rx="18" ry="3.5" fill="#1f4e9c" />
      <path d="M-8 2 Q-8 -10 0 -10 Q8 -10 8 2Z" fill="#1f4e9c" />
      <circle cx="-7" cy="-5" r="4" fill="#f57c00" />
      <circle cx="-11" cy="-9" r="2.5" fill="#fbb05e" />
      <path d="M-4 -8 Q2 -24 10 -22" stroke="#fbf8f2" strokeWidth="2" fill="none" />
    </>
  ),
}

// `portrait` shows the head and hat only, for small places where a whole stork would
// make its hat too small to see.
type Props = { hat?: HatId; size?: number; className?: string; label?: string; portrait?: boolean }

// Decorative unless given a label; a hat's name shows as a tooltip either way.
export function Stork({ hat, size = 64, className = '', label, portrait = false }: Props) {
  const tip = hat ? t('The stork in {hat}', { hat: hats[hat] }) : t('The stork')
  return (
    <svg
      viewBox={portrait ? '34 2 64 64' : '0 0 100 134'}
      width={size}
      height={portrait ? size : (size * 134) / 100}
      className={`stork ${className}`}
      data-hat={hat ?? 'none'}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    >
      <title>{tip}</title>
      <g stroke={BILL} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <polyline points="40,95 37,113 41,130 47,131" />
        <polyline points="50,95 55,112 52,130 58,131" />
      </g>
      <path d="M17 78 L6 85 L20 86Z" fill={INK} />
      <ellipse cx="44" cy="82" rx="27" ry="16" transform="rotate(-12 44 82)" fill="#fff" stroke={INK} strokeWidth="2" />
      <path d="M19 80 Q33 97 60 92 Q50 86 40 85 Q29 84 19 80Z" fill={INK} />
      <path d="M55 74 Q60 57 58 46 L69 45 Q71 60 66 77Z" fill="#fff" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M71 37 L96 45 L71 44Z" fill={BILL} stroke={BILL} strokeWidth="1" strokeLinejoin="round" />
      <circle cx="64" cy="40" r="9" fill="#fff" stroke={INK} strokeWidth="2" />
      <path d="M57.5 47 Q63 50 69 45" stroke="#fff" strokeWidth="3" fill="none" />
      <circle cx="66.5" cy="38" r="1.7" fill={INK} />
      {hat && <g transform="translate(64 31)">{hatArt[hat]}</g>}
    </svg>
  )
}

// The stork with something to say, in a speech bubble.
export function StorkSays({ hat, children, className = '', size = 56 }: { hat?: HatId; children: ReactNode; className?: string; size?: number }) {
  return (
    <div className={`stork-says ${className}`}>
      <Stork hat={hat} size={size} />
      <p className="stork-bubble">{children}</p>
    </div>
  )
}
