const paths: Record<string, React.ReactNode> = {
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
}

export function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="icon">
      {paths[name] ?? paths.map}
    </svg>
  )
}
