# Fetching from Wikimedia Commons

Commons often answers this project's cloud machines with 429, so files are fetched on a GitHub runner instead.

- Push a `claude/**` branch with `scripts/photos/<name>-missing.tsv`: one line per file, `id<TAB>Commons file<TAB>width`. Repeat an id on the next line for a fallback file. `.github/workflows/photos.yml` runs `fetch.py`, which saves photos as progressive JPEGs no wider than `width` (880 by default) in `src/photos`, and commits them with each file's Commons metadata in `scripts/photos/meta/<id>.json`. A file already saved is skipped, so a run that failed can simply be pushed again.
- A sound file (`.ogg`, `.oga`, `.wav`, `.opus`, `.flac`, `.mp3`) is converted with ffmpeg to a mono 64 kbps MP3 in `src/sounds`, evened out in loudness. The third column is then the span to keep in seconds, `0-45`, by default the first 75 seconds.
- Push `scripts/photos/<name>-query.json`, a list of `{ name, params }` Commons API queries, and `query.py` saves each result as `meta/query-<name>.json`, to search categories and file names when the API is blocked here.
- The runner commits to the branch, so pull before pushing again.

When the files arrive, add each photo to `src/photos/ids.ts`, `index.ts` and `credits.ts`, and each recording to `src/sounds/ids.ts`, `index.ts` and `credits.ts`, from the metadata. Then delete the lists, the queries and the metadata.

`na.py` fetches files from the Nationaal Archief instead, for Anefo and government photos (the credit still points at the Commons page).
