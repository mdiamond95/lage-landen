# Lage Landen

A Duolingo-style web app for learning the history and culture of the Netherlands and Belgium, built around maps, pictures and timelines.

Phase 1 from the project plan (Units 1 to 5) is built, Phase 2 (Units 6 to 9) is built, and the Netherlands track has begun with Unit 10. Playable now:

- Unit 1, Land and water: five lessons and a checkpoint, with a dike slider and an animated map of the Zuiderzee and Delta Works.
- Unit 2, Celts, Romans and Franks (57 BCE to 900): six lessons and a checkpoint, opening with an animated map of the Roman frontier and roads.
- Unit 3, Counts, bishops and cloth cities (900 to 1384): six lessons and a checkpoint, built around an animated map of the wool and cloth trade across the North Sea.
- Unit 4, The Burgundian Netherlands (1384 to 1555): six lessons and a checkpoint, built around a map of the lands joining Burgundy one by one, with a family tree from the dukes to Charles V and detail hunts in Flemish paintings.
- Unit 5, Revolt and the great split (1555 to 1648): six lessons and a checkpoint, built around a front-line map of the Eighty Years' War that shows refugees streaming north from Antwerp, with a population chart of Antwerp and Amsterdam and quotes from the Wilhelmus, the Union of Utrecht and the Act of Abjuration.
- Unit 6, Golden Age and Spanish Netherlands (1588 to 1700): six lessons and a checkpoint, built around a map of Amsterdam growing ring by ring on today's canals and a map of France taking the southern towns, with zoomable paintings by Rembrandt, Vermeer and Rubens.
- Unit 7, Trade, empire and slavery (1600 to 1863): six lessons and a checkpoint, built around a world map of VOC and WIC posts and ship routes, with the routes that carried enslaved Africans in their own colour. The lessons on slavery and conquest open with a content note and run in a calm mode, and the last lesson weighs two voices on the apology of 2022.
- Unit 8, Disaster year to Waterloo (1672 to 1815): six lessons and a checkpoint, built around a border-change map that steps year by year from the French invasion of 1672 through the Austrian Netherlands and the French years to Waterloo, with find-the-year questions on it in four lessons and two voices on whether Holland should stay a country of its own.
- Unit 9, One kingdom, then two (1815 to 1839): six lessons and a checkpoint on the United Kingdom of the Netherlands, the Belgian Revolution and the Treaty of London, built around a kingdom map that splits in 1830 and is settled in 1839, and a before-and-after swipe between 1815 and 1839.
- Unit 10, Constitution and pillars (1848 to 1914): six lessons and a checkpoint on Thorbecke's constitution, the colonial profits from Java and Max Havelaar, the school struggle and the pillars, workers and women fighting for the vote, railways and science, and Van Gogh and the painters of his time. Built around a diagram of the four pillars and a map of railways and canals connecting the country, with a chart of who could vote.

Around the units:

- A daily review: every question in a finished lesson comes back on a spaced schedule, missed ones sooner, ten at a time.
- A time map of 26 snapshots, from Caesar's conquest in 57 BCE to the Delta Works, built from the unit maps.
- XP, a day streak with one free missed day a week, and a map of the places discovered.
- Works offline once loaded, and installs on a phone's home screen.

The live site for testers is published to GitHub Pages from `main` by `.github/workflows/pages.yml`, at https://mdiamond95.github.io/lage-landen/ once Pages is switched on (Settings > Pages > Source: GitHub Actions).

## Run it

```sh
npm install
npm run dev          # local dev server
npm test             # unit tests and content checks
npm run e2e          # plays every lesson in a headless browser
npm run build        # static site in dist/
npm run build:single # one self-contained HTML file in dist-single/
```

## How it fits together

- `src/content/*.yaml`: lessons, one file per unit, checked against `src/content/schema.ts`. `npm test` fails if a lesson points at a place, province or river that doesn't exist, or has too few visual questions.
- `src/content/places.ts`: every place a lesson can pin.
- `src/data/lowlands.topo.json`: countries, provinces, rivers and the IJsselmeer from [Natural Earth](https://www.naturalearthdata.com/) (public domain), clipped and simplified with mapshaper.
- `src/map/`: the SVG map (d3-geo, Mercator), used for pins, region painting and story maps. `TimeMap.tsx` adds a year slider and a play button on top of it, drawing any `TimeStory` (lines, sites, labels and areas that were still sea, each with the years it existed). `TradeMap.tsx` is a wider North Sea map (England to the Ems, down to the Champagne fairs) with moving trade routes; both share `TimeControls.tsx` and `usePlayback.ts`.
- `src/data/northsea.topo.json`: land and main rivers for the trade map, from Natural Earth 10m, clipped to the North Sea frame and simplified with mapshaper.
- `src/data/water.ts`: the Zuiderzee works and the Delta Works for Unit 1, 1916 to 1997. Flevoland's province shape is cut into its three polders, which show as sea until they fall dry.
- `src/data/roman.ts`: the Roman frontier, roads, forts, towns and captions for the time map, each with the years it existed. Lessons can also draw these lines on an ordinary map with `lines: [limes]`.
- `src/data/burgundy.ts`: the lands joining the dukes of Burgundy and then Charles V, 1384 to 1555, for `{ kind: time-map, map: burgundy }`. Each territory is drawn with the modern provinces closest to it (`regions`), cut by a rough `clip` polygon where only part of one belongs; the map says its borders are approximate.
- `src/data/revolt.ts`: the revolt map for `{ kind: time-map, map: revolt }`, 1555 to 1648. Each land changes sides with `sides(...)`: the king's (`ruled`), the rebels' (`rebel`) or split between them (`contested`, hatched). Refugee routes are lines of kind `flow` (arrows with moving dashes), and battles and sieges are sites of kind `battle`. The story sets `fresh: 'outline'`, so lands that just changed sides are outlined rather than refilled.
- `src/data/amsterdam.ts`: Amsterdam's growth for `{ kind: time-map, map: amsterdam }`, 1550 to 1700, drawn on `AmsterdamBase.tsx` instead of the Low Countries (the story sets `base: 'amsterdam'`). Its water is today's canals, the IJ and the Amstel from the Kadaster's TOP10NL (via the PDOK API, CC BY 4.0) in `amsterdam.topo.json`. Each expansion is an area of kind `city`, listed newest first so only the newest ring shows as just added; walls are lines of kind `wall`.
- `src/data/spanish.ts`: the Republic and the Spanish Netherlands for `{ kind: time-map, map: spanish }`, 1648 to 1700, with the towns France took as areas of kind `france`.
- `src/data/empire.ts`: the VOC and WIC across the world for `{ kind: time-map, map: empire }`, 1602 to 1863, drawn on `WorldBase.tsx` (the story sets `base: 'world'`; Equal Earth projection, centred on the Cape). Land is Natural Earth 50m (public domain) in `world.topo.json`, clipped to the Caribbean–Japan frame and simplified with mapshaper. Posts are sites of kind `voc` or `wic`; ship routes are `flow` lines with a `tone` (`asia`, `atlantic` or `enslaved`), each with its own arrowhead and key colour. Colonies are areas of kind `ruled` drawn from a rough `shape`.
- `src/data/borders.ts`: the borders of the Low Countries for `{ kind: time-map, map: borders }`, 1672 to 1815, built with `sides(...)` from the revolt map and the regions of the Burgundy and Spanish maps. Two kinds of area join the others: `austria` for the Austrian Netherlands from 1714 and `sister` for the Batavian Republic and Kingdom of Holland, French client states from 1795 to 1810. France's conquests are `france`, lands held by allied armies are `contested`, and the Water Line, William's fleet of 1688 and the Prussian march of 1787 are lines. Barrier fortresses (1715 to 1781) are sites of kind `fort`.
- `src/data/kingdom.ts`: the United Kingdom of the Netherlands and its split, for `{ kind: time-map, map: kingdom }`, 1815 to 1839. Two kinds of area join the others: `belgium` from 1830 and `duchy` for Luxembourg, the king's grand duchy; half of Limburg and half of Luxembourg go back to the king in 1839. New canals are lines of kind `canal`, the Wellington Barrier forts (1816 to 1829) and the forts the Dutch held after 1830 are sites of kind `fort`.
- `src/data/rails.ts`: railways and canals for `{ kind: time-map, map: rails }`, 1839 to 1914, with lines of kind `rail`, the North Sea Canal and the Nieuwe Waterweg as `canal`, the Haarlemmermeer as a hand-drawn `shape` of sea until it is drained in 1852, and Luxembourg leaving the Dutch crown in 1890.
- `src/data/pillars.ts` and `src/art/PillarDiagram.tsx`: the pillars of Dutch society (`{ kind: pillars }`), four columns of party, paper, union, broadcaster and schools under one roof; tap a pillar's name to bring it forward. `hide: socialist.radio` blanks one cell for a question, and `only: radio` shows a single row.
- `src/map/CompareMap.tsx`: before and after (`{ kind: compare, map: kingdom, years: [1815, 1839] }`): two years of any time map but the cloth map laid one over the other, with a divider to drag (or move with the arrow keys) that wipes from the earlier year on the left to the later one on the right. It works as a story card or as the visual of a question.
- `src/data/charts.ts`: line charts from real figures (`antwerp-amsterdam`, `voters`), drawn by `{ kind: chart, chart: antwerp-amsterdam }`; `until: 1568` stops a chart at a year.
- `src/data/families.ts`: family trees (`carolingians`, `burgundy`), drawn by `{ kind: family-tree, tree: burgundy }`; `hide: mary` blanks out one person for a question.
- `src/data/cloth.ts`: wool, cloth and other trade routes, towns and captions for the trade map, 1100 to 1384. A route can pause for a few years with `off` (the wool ban of 1336). Any time map opens at a chosen year with `{ kind: time-map, map: cloth, year: 1336 }` (or `map: water` or `map: roman`).
- `src/exercises/`: story cards, pin the map, paint the region, timeline order, picture choice, true or myth, match pairs, who am I (clues revealed one at a time beside a portrait or statue; answering before the last clue earns +2 XP), find the year (`scrub`: drag a time map's slider until the map shows what the prompt asks, with the captions hidden until checked) and find the detail (`hunt`: tap a detail inside a painting; `targets` are boxes as fractions of the picture), fill the gap (`gap`: pick the missing word in a quote from a primary source, marked `___`, with its `source`), odd one out (`odd`: pick which of four pictures doesn't belong, then the right reason; both must be right) cause and effect (`cause`: link each cause to its effect, with an `explain` shown after) voices (`voices`: two or three quoted people side by side, with a question on how they differ) and sort into groups (`sort`: tap a card, then the group it belongs in, until every card is placed; cards can carry a picture, and the question can show a map or diagram). Picture choice, true or myth and fill the gap can show a photo, map, before-and-after map, family tree or chart; a choice on a chart is shown as "Read the chart".
- `src/photos/`: photos, paintings and historical maps from Wikimedia Commons, with author and licence for each in `credits.ts`. Paintings full of detail are saved at 1280 to 1600 px and marked `zoom: true`, so they can be zoomed into with buttons, a pinch or a trackpad (`ZoomImage.tsx`); detail hunts can always be zoomed. A Who am I? holds back the picture's credit until it is answered, so self-portraits are credited honestly.
- `src/art/`: original illustrations and the dike cross-section slider.
- `src/progress/store.ts`: XP, streak (with one free missed day per week), discovered places and review cards, kept in the browser.
- `src/progress/review.ts` and `src/content/cards.ts`: the daily review. Every question is a card named by its lesson and a hash of the question (so an edited question starts afresh). A right answer brings it back in 1 day, then 3, then further out by the card's ease; a miss brings it back tomorrow. The review takes up to ten due cards, the most missed first, shuffled so eras mix.
- Content notes: a lesson with `note:` opens with a "Before you begin" card and runs calmly: a plain "Correct" in place of "Spot on!", and no trophy or "Perfect lesson!" at the end. The plan asks for this on slavery, colonial Indonesia and the other sensitive topics. A unit with any noted lesson needs its own `note:` too, which its checkpoint shows; a daily review that draws on a noted lesson is calm as well.
- `src/data/throughTime.ts`: the 26-snapshot time map (`TimeMap` with `snapshots`, so the slider steps from snapshot to snapshot). It reuses each era's lines, sites, labels and areas, starting each era at its first snapshot and dropping them when it ends, so eras that share years (the Spanish and border maps both show 1672 to 1700) never draw over each other.
- `scripts/sw.js`, `public/manifest.webmanifest`: offline and install. The build writes `dist/sw.js` listing every built file, pictures included, so the whole course is saved on first visit.

## Writing a lesson

Add an entry under `lessons:` in a unit's YAML. Start with a `story`, then mix question types; each lesson needs at least six questions, half of them visual, and at least one source.

## Unit checklist

Each new unit is held to what the best units so far do, and when one is finished the earlier units are reviewed against it (see the retrospective notes in each PR). `npm test` enforces the first two, and requires a fill-the-gap, a cause and effect, an odd one out, a sort into groups and a before-and-after map in every unit (Unit 3's cloth map, which draws routes rather than borders, is exempt).

- At least 70% of the unit's questions are answered on, or show, a map or picture, and every lesson at least half.
- At least one "Who am I?" and true or myth questions that show a picture or map.
- Paintings and old pictures are worked with, not just shown: a detail hunt where a picture has a telling detail, and find-the-year questions on the unit's time map in at least two lessons.
- A signature interactive piece: a slider or a year-slider map, reused in later questions with `year`, and a before-and-after swipe between two of its years.
- Myths and legends taught as such: a true or myth that tests a popular story against the evidence.
- Primary sources read, not just cited: a fill-the-gap question on a quote from a document, song or letter of the time.
- Things compared: an odd one out with a picture for each choice, and a reason to pick, and a sort into groups (by side, maker, era or country), with pictures on the cards where they help.
- Causes linked to effects, and numbers read from a real chart where the unit has figures worth showing.
- Every claim fact-checked against a source listed on the lesson, with figures kept consistent across units.
- Real photos, paintings and maps from Wikimedia Commons, each credited in `src/photos/credits.ts`.
- Several points of view where historians or the people involved disagree, each quoted from a source (`voices`).
- Sensitive topics (slavery, conquest, colonial violence, war crimes) get a content note, plain wording and no celebrations.
- The unit adds its snapshot(s) to the time map in `src/data/throughTime.ts`.
