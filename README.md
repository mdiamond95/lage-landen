# Lage Landen

A Duolingo-style web app for learning the history and culture of the Netherlands and Belgium, built around maps, pictures and timelines.

Phase 1 from the project plan is under way. Playable so far:

- Unit 1, Land and water: five lessons and a checkpoint, with a dike slider and an animated map of the Zuiderzee and Delta Works.
- Unit 2, Celts, Romans and Franks (57 BCE to 900): six lessons and a checkpoint, opening with an animated map of the Roman frontier and roads.
- Unit 3, Counts, bishops and cloth cities (900 to 1384): six lessons and a checkpoint, built around an animated map of the wool and cloth trade across the North Sea.
- Unit 4, The Burgundian Netherlands (1384 to 1555): six lessons and a checkpoint, built around a map of the lands joining Burgundy one by one, with a family tree from the dukes to Charles V and detail hunts in Flemish paintings.
- Unit 5, Revolt and the great split (1555 to 1648): six lessons and a checkpoint, built around a front-line map of the Eighty Years' War that shows refugees streaming north from Antwerp, with a population chart of Antwerp and Amsterdam and quotes from the Wilhelmus, the Union of Utrecht and the Act of Abjuration.

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
- `src/data/charts.ts`: line charts from real figures (`antwerp-amsterdam`), drawn by `{ kind: chart, chart: antwerp-amsterdam }`; `until: 1568` stops a chart at a year.
- `src/data/families.ts`: family trees (`carolingians`, `burgundy`), drawn by `{ kind: family-tree, tree: burgundy }`; `hide: mary` blanks out one person for a question.
- `src/data/cloth.ts`: wool, cloth and other trade routes, towns and captions for the trade map, 1100 to 1384. A route can pause for a few years with `off` (the wool ban of 1336). Any time map opens at a chosen year with `{ kind: time-map, map: cloth, year: 1336 }` (or `map: water` or `map: roman`).
- `src/exercises/`: story cards, pin the map, paint the region, timeline order, picture choice, true or myth, match pairs, who am I (clues revealed one at a time beside a portrait or statue; answering before the last clue earns +2 XP), find the year (`scrub`: drag a time map's slider until the map shows what the prompt asks, with the captions hidden until checked) and find the detail (`hunt`: tap a detail inside a painting; `targets` are boxes as fractions of the picture), fill the gap (`gap`: pick the missing word in a quote from a primary source, marked `___`, with its `source`) and cause and effect (`cause`: link each cause to its effect, with an `explain` shown after). Picture choice, true or myth and fill the gap can show a photo, map, family tree or chart; a choice on a chart is shown as "Read the chart".
- `src/photos/`: photos, paintings and historical maps from Wikimedia Commons, with author and licence for each in `credits.ts`.
- `src/art/`: original illustrations and the dike cross-section slider.
- `src/progress/store.ts`: XP, streak (with one free missed day per week) and discovered places, kept in the browser.

## Writing a lesson

Add an entry under `lessons:` in a unit's YAML. Start with a `story`, then mix question types; each lesson needs at least six questions, half of them visual, and at least one source.

## Unit checklist

Each new unit is held to what the best units so far do, and when one is finished the earlier units are reviewed against it (see the retrospective notes in each PR). `npm test` enforces the first two.

- At least 70% of the unit's questions are answered on, or show, a map or picture, and every lesson at least half.
- At least one "Who am I?" and true or myth questions that show a picture or map.
- Paintings and old pictures are worked with, not just shown: a detail hunt where a picture has a telling detail, and a find-the-year question on the unit's time map.
- A signature interactive piece: a slider or a year-slider map, reused in later questions with `year`.
- Myths and legends taught as such: a true or myth that tests a popular story against the evidence.
- Primary sources read, not just cited: a fill-the-gap question on a quote from a document, song or letter of the time.
- Causes linked to effects, and numbers read from a real chart where the unit has figures worth showing.
- Every claim fact-checked against a source listed on the lesson, with figures kept consistent across units.
- Real photos, paintings and maps from Wikimedia Commons, each credited in `src/photos/credits.ts`.
