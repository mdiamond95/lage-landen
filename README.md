# Lage Landen

A Duolingo-style web app for learning the history and culture of the Netherlands and Belgium, built around maps, pictures and timelines.

Phase 1 from the project plan is under way. Playable so far:

- Unit 1, Land and water: four lessons and a checkpoint.
- Unit 2, Celts, Romans and Franks (57 BCE to 900): six lessons and a checkpoint, opening with an animated map of the Roman frontier and roads.

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
- `src/map/`: the SVG map (d3-geo, Mercator), used for pins, region painting and story maps. `TimeMap.tsx` adds a year slider and a play button on top of it.
- `src/data/roman.ts`: the Roman frontier, roads, forts, towns and captions for the time map, each with the years it existed. Lessons can also draw these lines on an ordinary map with `lines: [limes]`.
- `src/exercises/`: story cards, pin the map, paint the region, timeline order, picture choice, true or myth, match pairs. Picture choice and true or myth can both show a photo or map.
- `src/photos/`: photos, paintings and historical maps from Wikimedia Commons, with author and licence for each in `credits.ts`.
- `src/art/`: original illustrations and the dike cross-section slider.
- `src/progress/store.ts`: XP, streak (with one free missed day per week) and discovered places, kept in the browser.

## Writing a lesson

Add an entry under `lessons:` in a unit's YAML. Start with a `story`, then mix question types; each lesson needs at least six questions, half of them visual, and at least one source.
