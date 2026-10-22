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
  // Unit 18: a pencil, for Van Gogh's years of drawing; a sunflower, for Arles; a mask,
  // for Ensor; a grid, for Mondrian; a bowler hat, for Magritte; a picture frame, for
  // the collectors and museums.
  pencil: <path d="M15 4l5 5L9 20H4v-5zM13 6l5 5M4 15l5 5" fill="none" strokeLinejoin="round" />,
  sunflower: <path d="M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v3M12 15v7M7 5l2 2.5M17 5l-2 2.5M5 10h3M16 10h3M8 19c2-1 3-2 4-4M16 19c-2-1-3-2-4-4" fill="none" strokeLinejoin="round" />,
  mask: <path d="M4 5c5 2 11 2 16 0 0 8-3 14-8 14S4 13 4 5zM8 10c1-1 2-1 3 0M13 10c1-1 2-1 3 0M9 14.5c2 1.5 4 1.5 6 0" fill="none" strokeLinejoin="round" />,
  grid: <path d="M4 4h16v16H4zM10 4v16M4 10h16M15 10v10M10 15h5" fill="none" strokeLinejoin="round" />,
  bowler: <path d="M3 17c3 1.5 15 1.5 18 0M6 16.5V12a6 6 0 0 1 12 0v4.5M6 13.5c4 1 8 1 12 0" fill="none" strokeLinejoin="round" />,
  frame: <path d="M3 4h18v16H3zM6 7h12v10H6zM6 17l4-5 3 3 2-2 3 4" fill="none" strokeLinejoin="round" />,
  // Unit 17: a ladder, for Rubens's Descent from the Cross; a lute, for Utrecht's music
  // and candlelight; a painter's beret, for Rembrandt; a window, for Vermeer's rooms; a
  // goblet, for the still lifes; a cloud, for the skies of the landscape painters.
  ladder: <path d="M8 3v18M16 3v18M8 7h8M8 11h8M8 15h8M8 19h8" fill="none" strokeLinejoin="round" />,
  lute: <path d="M14 10a6 6 0 1 1-8.5 8.5A6 6 0 0 1 14 10zM12.5 11.5 20 4M18 3l3 3M9 15h.01M7.5 17.5l3-3" fill="none" strokeLinejoin="round" />,
  beret: <path d="M3 12c0-4 4-6 9-6s9 2 9 6c0 1.5-2 2.5-5 2.5H8c-3 0-5-1-5-2.5zM6 14.5c0 3 2.5 5.5 6 5.5s6-2.5 6-5.5M12 6V4" fill="none" strokeLinejoin="round" />,
  window: <path d="M5 3h14v18H5zM12 3v18M5 11h14M8 15l2 2M14 6l2 2" fill="none" strokeLinejoin="round" />,
  goblet: <path d="M7 3h10c0 6-2 9-5 9s-5-3-5-9zM12 12v6M8 21h8M9 18h6M7.5 7h9" fill="none" strokeLinejoin="round" />,
  cloud: <path d="M6 18a4 4 0 0 1-.5-8 6 6 0 0 1 11.5-1.5A4.5 4.5 0 0 1 17.5 18zM3 21h18" fill="none" strokeLinejoin="round" />,
  // Unit 19: a belfry, for the towers of the towns; a pointed arch, for the churches; a
  // stepped gable, for the canal houses; a windmill; a whiplash curve, for Art Nouveau;
  // a cube, for the modern architects.
  belfry: <path d="M8 21V10h8v11M7 10h10M9 10V6l3-4 3 4v4M10 6h4M10.5 14h3M12 17.5v3.5" fill="none" strokeLinejoin="round" />,
  arch: <path d="M5 21V11c0-4 3-7 7-9 4 2 7 5 7 9v10M9 21v-8c0-1.5 1.5-3 3-4 1.5 1 3 2.5 3 4v8M3 21h18" fill="none" strokeLinejoin="round" />,
  gable: <path d="M5 21V12h2V9h2V6h2V3h2v3h2v3h2v3h2v9zM10 21v-4h4v4M9 13h2M13 13h2" fill="none" strokeLinejoin="round" />,
  mill: <path d="M10 21l1-9h2l1 9zM12 11 6 5M12 11l6-6M12 11l-6 6M12 11l6 6M8 21h8" fill="none" strokeLinejoin="round" />,
  whiplash: <path d="M5 21c0-6 3-9 7-9s5-3 3-5-6 0-5 3 5 3 7 0M5 21h4" fill="none" strokeLinejoin="round" />,
  cube: <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9" fill="none" strokeLinejoin="round" />,
  atom: (
    <>
      <circle cx="12" cy="12" r="1.8" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.8" fill="none" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.8" fill="none" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9.5" ry="3.8" fill="none" transform="rotate(120 12 12)" />
    </>
  ),
  // Unit 20: a bird, for the oldest line of Dutch; an ear, for the dialect map; a
  // pompeblêd leaf from the Frisian flag; a hand puppet, for Tchantchès of Liège; two
  // speech bubbles, for the phrasebook.
  bird: <path d="M3 13c3 0 5-1 7-4 1-2 3-3 5-3 2 0 3 1 4 2l2 1-2 1c0 5-4 8-9 8-3 0-5-1-7-3 2 0 4-1 5-2M15 9h.01" fill="none" strokeLinejoin="round" />,
  ear: <path d="M7 10a5 5 0 0 1 10 0c0 3-2 4-3 6s-1 4-3 4-3-1-3-2M10 10a2 2 0 0 1 4 0c0 1-1 2-2 2" fill="none" strokeLinejoin="round" />,
  leaf: <path d="M12 20C7 16 4 13 4 9.5A4 4 0 0 1 12 7a4 4 0 0 1 8 2.5c0 3.5-3 6.5-8 10.5zM12 20v2" fill="none" strokeLinejoin="round" />,
  puppet: (
    <>
      <circle cx="12" cy="7" r="3.5" fill="none" />
      <path d="M8.5 5.5 12 2l3.5 3.5M6 21l1-7c1-2 3-3 5-3s4 1 5 3l1 7M4 13l3 1M20 13l-3 1" fill="none" strokeLinejoin="round" />
    </>
  ),
  chat: <path d="M3 5h11v8H8l-3 3v-3H3zM17 9h4v8h-2v3l-3-3h-5v-2" fill="none" strokeLinejoin="round" />,
  // Unit 21: a wedge of cheese; a herring; a waffle, for the sweets; a cone of fries; a
  // beer glass; a cooking pot, for the everyday table.
  cheese: <path d="M3 18h18V11L3 18zM3 18v2h18v-9M14 15.5h.01M18 14h.01" fill="none" strokeLinejoin="round" />,
  fish: <path d="M3 12c3-5 10-5 13 0-3 5-10 5-13 0zM16 12l5-4v8zM7.5 11h.01" fill="none" strokeLinejoin="round" />,
  waffle: <path d="M4 4h16v16H4zM9.3 4v16M14.7 4v16M4 9.3h16M4 14.7h16" fill="none" strokeLinejoin="round" />,
  fries: <path d="M6 10h12l-2 11H8zM8 10 7 3M11 10V2M14 10l1-7M17 10l2-5M8.5 14h7" fill="none" strokeLinejoin="round" />,
  beer: <path d="M5 7h11l-1 14H6zM16 10h2.5a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5H15.5M5 7c0-2 2-3 3-2 1-2 4-2 5 0 1-1 3 0 3 2" fill="none" strokeLinejoin="round" />,
  pot: <path d="M4 10h16v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM2 10h20M9 3c-1 2 1 3 0 5M14 3c-1 2 1 3 0 5" fill="none" strokeLinejoin="round" />,
  // Unit 22: a calendar page, for the year of feasts; a bishop's mitre, for Sinterklaas; a giant
  // of the processions. Carnival takes the mask, King's Day the crown and Keti Koti the broken chain.
  calendar: <path d="M4 6h16v14H4zM4 10h16M8 3v5M16 3v5M8 14h2M14 14h2M8 17h2" fill="none" strokeLinejoin="round" />,
  mitre: <path d="M6 21h12V9l-6-6-6 6zM12 7v10M9 12h6M6 9l6 3 6-3" fill="none" strokeLinejoin="round" />,
  giant: <path d="M12 2.5a2.5 2.5 0 1 0 .01 0zM9 8h6l3 13H6zM9 8 5 13M15 8l4 5M10 21v-5M14 21v-5" fill="none" strokeLinejoin="round" />,
  // Unit 23: a bicycle; cobbles on a hill, for the Tour of Flanders; a rider's jersey, for Merckx;
  // a football; the Olympic torch. The ice lesson takes the skate.
  bicycle: <path d="M6 13a4 4 0 1 0 .01 0zM18 13a4 4 0 1 0 .01 0zM6 17l4-7h6l2 7M10 10l2 7 4-7M14 6h3" fill="none" strokeLinejoin="round" />,
  cobbles: <path d="M2 20 22 8M5 21h4v-2H5zM11 21h4v-2h-4zM17 21h4v-2h-4zM8 17h4v-2H8zM14 17h4v-2h-4zM17 13h4v-2h-4z" fill="none" strokeLinejoin="round" />,
  jersey: <path d="M9 3 4 6l2 4 2-1v12h8V9l2 1 2-4-5-3a3 3 0 0 1-6 0z" fill="none" strokeLinejoin="round" />,
  ball: <path d="M12 3a9 9 0 1 0 .01 0zM12 8l3.5 2.5-1.3 4h-4.4l-1.3-4zM12 3v5M15.5 10.5l5-1.5M14.2 14.5l3 4M9.8 14.5l-3 4M8.5 10.5l-5-1.5" fill="none" strokeLinejoin="round" />,
  torch: <path d="M9 10h6l-2 11h-2zM12 2c1 2 3 3 3 5a3 3 0 0 1-6 0c0-1.5 1-2 1-3 1 .5 1.5 1.2 1.5 2 .5-1 .5-2.5.5-4z" fill="none" strokeLinejoin="round" />,
  // Unit 24: Tintin's quiff, a Smurf's cap, a speech balloon, Miffy's ears, a note and a strip of film.
  quiff: <path d="M6 14a6 6 0 0 0 12 0c0-3-1.5-5-4-6 1-1 1-3 0-5-1 2-3 3-5 4-2 1-3 3-3 7zM10 14h.01M14 14h.01M10.5 17.5c1 .7 2 .7 3 0" fill="none" strokeLinejoin="round" />,
  cap: <path d="M4 20c0-6 2-11 6-13 3-2 7-2 8 1 1 2-1 3-2 2 1 3 2 6 2 10zM3 20h18" fill="none" strokeLinejoin="round" />,
  balloon: <path d="M4 5h16v10h-9l-4 4v-4H4zM8 9h8M8 12h5" fill="none" strokeLinejoin="round" />,
  rabbit: <path d="M9 10C8 7 8 3 9.5 3S11 7 11 10M15 10c1-3 1-7-.5-7S13 7 13 10M6 15a6 5 0 0 0 12 0 6 5 0 0 0-12 0zM10 14h.01M14 14h.01M11 17l1 .5 1-.5" fill="none" strokeLinejoin="round" />,
  note: <path d="M9 18V5l11-2v13M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zM20 16a3 3 0 1 1-3-3 3 3 0 0 1 3 3zM9 9l11-2" fill="none" strokeLinejoin="round" />,
  film: <path d="M4 3h16v18H4zM8 3v18M16 3v18M4 7.5h4M4 12h4M4 16.5h4M16 7.5h4M16 12h4M16 16.5h4" fill="none" strokeLinejoin="round" />,
  // Unit 25: a printing press, a bone, a pair of dividers, a pendulum, a microscope and a medal.
  press: <path d="M5 21V4h14v17M3 21h18M12 4v5M9 6h6M8 9h8v3H8zM6 16h12" fill="none" strokeLinejoin="round" />,
  bone: <path d="M7 10.5h10M7 13.5h10M3.5 9.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0M3.5 14.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0M16.5 9.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0M16.5 14.5a2 2 0 1 0 4 0 2 2 0 1 0-4 0" fill="none" strokeLinejoin="round" />,
  dividers: <path d="M10 5a2 2 0 1 0 4 0 2 2 0 1 0-4 0M11 6.8 6 21M13 6.8 18 21M8.5 14h7" fill="none" strokeLinejoin="round" />,
  pendulum: <path d="M4 3h16M12 3l3 12M12 18a3 3 0 1 0 6 0 3 3 0 1 0-6 0M5 13c1.5 2 3.5 3.5 6 4" fill="none" strokeLinejoin="round" />,
  microscope: <path d="M5 21h14M9 3l4 2-3.5 7.5-4-2zM11 11.5l2 3M15 21c3.5-3 3-8.5-1.5-10.5M8 17h7" fill="none" strokeLinejoin="round" />,
  medal: <path d="M8 2l3 7M16 2l-3 7M12 9a6 6 0 1 0 .01 0zM10.5 13.5 12 12.5v5" fill="none" strokeLinejoin="round" />,
}

export function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="icon">
      {paths[name] ?? paths.map}
    </svg>
  )
}
