# Lage Landen

A Duolingo-style web app for learning the history and culture of the Netherlands and Belgium, built around maps, pictures and timelines.

This is the phase 0 prototype from the project plan: Unit 1 (Land and water) with four lessons, a checkpoint, and seven exercise types.

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
- `src/map/`: the SVG map (d3-geo, Mercator), used for pins, region painting and story maps.
- `src/exercises/`: story cards, pin the map, paint the region, timeline order, picture choice, true or myth, match pairs.
- `src/art/`: original illustrations and the dike cross-section slider.
- `src/progress/store.ts`: XP, streak (with one free missed day per week) and discovered places, kept in the browser.

## Writing a lesson

Add an entry under `lessons:` in a unit's YAML. Start with a `story`, then mix question types; each lesson needs at least six questions, half of them visual, and at least one source.
