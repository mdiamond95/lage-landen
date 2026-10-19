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
  shield: <path d="M12 3 4 6v6c0 5 4 8 8 9 4-1 8-4 8-9V6z" fill="none" />,
}

export function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="icon">
      {paths[name] ?? paths.map}
    </svg>
  )
}
