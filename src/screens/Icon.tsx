export const paths: Record<string, React.ReactNode> = {
  logo: <path d="M3 17h18M5 17l3-8 4 4 3-6 4 10" fill="none" strokeLinejoin="round" />,
  flame: <path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-7 2 1 3 2 3 4 1-2 0-5 0-7z" fill="currentColor" stroke="none" />,
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="currentColor" stroke="none" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" fill="none" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" />
    </>
  ),
  trophy: <path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v4M8 20h8" fill="none" />,
  map: <path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14" fill="none" />,
  river: <path d="M4 4c6 3-2 7 4 10s2 6 8 6M12 4c5 3-1 6 4 9" fill="none" />,
  wave: <path d="M2 14c3-3 5-3 7 0s5 3 7 0 4-3 6 0M2 19c3-3 5-3 7 0s5 3 7 0 4-3 6 0M12 3v7" fill="none" />,
  polder: <path d="M3 20h18M4 20l3-11h10l3 11M10 9l-1 11M14 9l1 11M5.5 14.5h13M12 9V4l3 2-3 1" fill="none" strokeLinejoin="round" />,
  shield: <path d="M12 3 4 6v6c0 5 4 8 8 9 4-1 8-4 8-9V6z" fill="none" />,
  helmet: <path d="M5 15a7 7 0 0 1 14 0v2h-4v4M5 15v2h4v4M12 8V3M9 3h6M9 12h6" fill="none" strokeLinejoin="round" />,
  tower: <path d="M7 21V9h10v12M5 9h14M7 9V5h2v2h2V5h2v2h2V5h2v4M10 21v-4a2 2 0 0 1 4 0v4" fill="none" strokeLinejoin="round" />,
  road: <path d="M8 3 4 21M16 3l4 18M12 4v3M12 11v3M12 18v3" fill="none" />,
  cross: <path d="M12 3v18M7 8h10" fill="none" />,
  ship: <path d="M3 15h18l-3 5H6zM12 15V3l6 9h-6M8 8l4-5" fill="none" strokeLinejoin="round" />,
  bell: <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4M12 3v2" fill="none" strokeLinejoin="round" />,
  coin: (
    <>
      <circle cx="12" cy="12" r="8" fill="none" />
      <path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.6 2.5 2 2.5.9 2.5 2-1 2-2.5 2c-1 0-2-.5-2.5-1.5M12 6.5v1.5M12 16v1.5" fill="none" />
    </>
  ),
  sword: <path d="M19 3 9 13M19 3v4l-9 9M19 3h-4M7 12l5 5M8 16l-4 4M5 15l4 4" fill="none" strokeLinejoin="round" />,
  brush: <path d="M14 4l6 6-8 8-6-6zM6 12l-2 2c-1 1-1 3 0 4l2 2c1 1 3 1 4 0l2-2" fill="none" strokeLinejoin="round" />,
  book: <path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1zM12 6v14" fill="none" strokeLinejoin="round" />,
  crown: <path d="M4 18 3 7l5 4 4-6 4 6 5-4-1 11zM4 21h16" fill="none" strokeLinejoin="round" />,
  tulip: <path d="M12 21v-9M12 12c-4 0-6-3-6-8l3 2 3-3 3 3 3-2c0 5-2 8-6 8zM12 18c-2-2-5-2-6-1 2 2 4 2 6 1zM12 18c2-2 5-2 6-1-2 2-4 2-6 1" fill="none" strokeLinejoin="round" />,
  // A globe, for trade around the world; a broken chain, for the end of slavery; a
  // feather pen, for the lessons told through people's own words.
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" fill="none" />
      <path d="M3.5 12h17M12 3.5c-3 3-3 14 0 17M12 3.5c3 3 3 14 0 17" fill="none" />
    </>
  ),
  chain: <path d="M9.5 14.5 7 17a3 3 0 0 1-4-4l3-3a3 3 0 0 1 4 0M14.5 9.5 17 7a3 3 0 0 1 4 4l-3 3a3 3 0 0 1-4 0M11 6l1-3M13 18l-1 3M6 10.5 4 9M18 13.5l2 1.5" fill="none" strokeLinejoin="round" />,
  quill: <path d="M20 3c-7 1-12 6-13 13l-3 5M7 16c4 0 8-3 9-7M10 13l-3-1" fill="none" strokeLinejoin="round" />,
  lens: <path d="M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM15 15l6 6M7 8a3 3 0 0 1 3-2" fill="none" />,
  // A candle, for remembrance; a lantern, for hiding in the dark; a flag, for liberation.
  candle: <path d="M9 21h6M9 21V10h6v11M12 10V8M12 3c-1.5 2-1.5 3.5 0 5 1.5-1.5 1.5-3 0-5z" fill="none" strokeLinejoin="round" />,
  lantern: <path d="M9 4h6M12 2v2M8 7h8l-1-3H9zM8 7v11h8V7M7 18h10l-1 3H8zM12 10c-1 1.5-1 3 0 4 1-1 1-2.5 0-4z" fill="none" strokeLinejoin="round" />,
  flag: <path d="M5 21V3M5 4c4-2 7 2 14 0v9c-7 2-10-2-14 0" fill="none" strokeLinejoin="round" />,
  // A steam train, for the railways; a miner's pick, for the coal country.
  train: <path d="M7 3h10a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2zM5 10h14M9 13.5h.01M15 13.5h.01M8 17l-3 4M16 17l3 4" fill="none" strokeLinejoin="round" />,
  pick: <path d="M3 9c5-5 13-5 18 0M14 6.2 6 21M10.5 5.8l4.5 1.6" fill="none" strokeLinejoin="round" />,
  // A poppy, for the fields of Flanders and the dead of the First World War.
  poppy: (
    <>
      <path d="M12 11c-3-5-8-4-8 0 0 3 3 4 5 3M12 11c3-5 8-4 8 0 0 3-3 4-5 3M9 14c-1 3 1 5 3 5s4-2 3-5M12 19v3" fill="none" strokeLinejoin="round" />
      <circle cx="12" cy="12.5" r="1.6" fill="currentColor" stroke="none" />
    </>
  ),
  // Two speech bubbles, for the two languages; a signpost, for the language border; a
  // megaphone, for the protests; three layers, for the state reforms; an atom, for Expo 58.
  speech: <path d="M3 5h11v7H8l-3 3v-3H3zM14 9h7v7h-2v3l-3-3h-5v-4" fill="none" strokeLinejoin="round" />,
  signpost: <path d="M12 3v18M8 21h8M5 6h11l3 2.5-3 2.5H5zM19 13H8l-3 2.5L8 18h11z" fill="none" strokeLinejoin="round" />,
  megaphone: <path d="M3 10v4h3l9 5V5L6 10zM6 14l1.5 6h3L9 15M18 9c1.5 1 1.5 5 0 6M20 7c3 2.5 3 7.5 0 10" fill="none" strokeLinejoin="round" />,
  layers: <path d="m12 3 9 4.5-9 4.5-9-4.5zM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5" fill="none" strokeLinejoin="round" />,
  altarpiece: <path d="M4 7h5v13H4zM9 4h6v16H9zM15 7h5v13h-5zM12 8v5M10 10h4" fill="none" strokeLinejoin="round" />,
  tear: <path d="M12 3c3 5 6 8 6 12a6 6 0 0 1-12 0c0-4 3-7 6-12zM9.5 15a2.5 2.5 0 0 0 2.5 2.5" fill="none" strokeLinejoin="round" />,
  scales: <path d="M12 3v17M8 20h8M5 6h14M5 6l-3 7a3 3 0 0 0 6 0zM19 6l-3 7a3 3 0 0 0 6 0z" fill="none" strokeLinejoin="round" />,
  owl: <path d="M6 4l2 3h8l2-3v10a6 6 0 0 1-12 0zM9.5 9.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM14.5 9.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM12 13v2M9 21l1-1.5M15 21l-1-1.5" fill="none" strokeLinejoin="round" />,
  easel: <path d="M5 4h14v10H5zM12 2v2M8 14l-3 7M16 14l3 7M12 14v5" fill="none" strokeLinejoin="round" />,
  skate: <path d="M6 4h5v8l7 2a2 2 0 0 1 1 2H6zM4 19h15a2 2 0 0 0 2-2M8 16v3M16 16v3" fill="none" strokeLinejoin="round" />,
  // Unit 17: a ladder, for Rubens's Descent from the Cross; a lute, for Utrecht's music
  // and candlelight; a painter's beret, for Rembrandt; a window, for Vermeer's rooms; a
  // goblet, for the still lifes; a cloud, for the skies of the landscape painters.
  ladder: <path d="M8 3v18M16 3v18M8 7h8M8 11h8M8 15h8M8 19h8" fill="none" strokeLinejoin="round" />,
  lute: <path d="M14 10a6 6 0 1 1-8.5 8.5A6 6 0 0 1 14 10zM12.5 11.5 20 4M18 3l3 3M9 15h.01M7.5 17.5l3-3" fill="none" strokeLinejoin="round" />,
  beret: <path d="M3 12c0-4 4-6 9-6s9 2 9 6c0 1.5-2 2.5-5 2.5H8c-3 0-5-1-5-2.5zM6 14.5c0 3 2.5 5.5 6 5.5s6-2.5 6-5.5M12 6V4" fill="none" strokeLinejoin="round" />,
  window: <path d="M5 3h14v18H5zM12 3v18M5 11h14M8 15l2 2M14 6l2 2" fill="none" strokeLinejoin="round" />,
  goblet: <path d="M7 3h10c0 6-2 9-5 9s-5-3-5-9zM12 12v6M8 21h8M9 18h6M7.5 7h9" fill="none" strokeLinejoin="round" />,
  cloud: <path d="M6 18a4 4 0 0 1-.5-8 6 6 0 0 1 11.5-1.5A4.5 4.5 0 0 1 17.5 18zM3 21h18" fill="none" strokeLinejoin="round" />,
  atom: (
    <>
      <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.8" fill="none" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.8" fill="none" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.8" fill="none" transform="rotate(120 12 12)" />
    </>
  ),
}

export function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="icon">
      {paths[name] ?? paths.map}
    </svg>
  )
}
