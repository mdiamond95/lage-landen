# Fetching Commons photos

`fetch.py` downloads Wikimedia Commons files through the nl.wikipedia API, which also serves Commons files. It sends a User-Agent, waits out the full `retry-after` on a 429, pauses 15 s between files, and saves progressive JPEGs no wider than the given width. Each file's Commons metadata (artist, licence, description) goes to a JSON file for writing its credit.

    python3 scripts/photos/fetch.py scripts/photos/unit-10-missing.tsv src/photos /tmp/photo-meta

`unit-10-missing.tsv` lists the 33 Unit 10 photos that were still missing when PR #11 opened, because Wikimedia answered every request with 429 from about 16:15 UTC on 2026-10-20. Each line gives the id, the Commons file, the maximum width and the lessons that use the photo.

Each id is already in `src/photos/ids.ts`. For each photo that arrives:

- Add an import and a map entry in `src/photos/index.ts`, in the "Unit 10" block.
- Add a credit in `src/photos/credits.ts`, using `commons(file)` and the licence from the metadata.
- Who am I? photos are kuyper, domela, aletta-jacobs, wilhelmina-1885 and van-gogh-self. Their alt text and caption must not name the person, and a caption on van-gogh-self must not mention the Van Gogh Museum.
- potato-eaters is a detail hunt saved at 1600 px with `zoom: true`. Check its target box, `[0.38, 0.0, 0.2, 0.22]` for the hanging lamp in `u10-l6`, against the saved image.
