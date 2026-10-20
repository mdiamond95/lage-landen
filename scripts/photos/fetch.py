# Fetch Commons photos via the nl.wikipedia API (shared repository) and save them
# as progressive JPEGs. Input: a TSV of id<TAB>File name<TAB>width. Metadata goes to meta/<id>.json.
import io, json, os, sys, time, urllib.parse, urllib.request
from PIL import Image
UA = "LageLandenBot/1.0 (https://github.com/mdiamond95/lage-landen; mdiamond95)"
src, outdir, metadir = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(metadir, exist_ok=True)
def fetch(url, binary=False):
    for _ in range(40):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=120) as r:
                data = r.read()
                return data if binary else json.loads(data)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                w = int(e.headers.get("retry-after", "30"))
                print("  429, waiting", w, file=sys.stderr); time.sleep(w + 5); continue
            raise
    raise RuntimeError("gave up " + url)
for line in open(src):
    if not line.strip() or line.startswith("#"): continue
    pid, fname, width = (line.rstrip("\n").split("\t") + ["880"])[:3]
    width = int(width)
    out = os.path.join(outdir, pid + ".jpg")
    if os.path.exists(out) and os.path.exists(os.path.join(metadir, pid + ".json")):
        continue
    q = urllib.parse.urlencode({"action": "query", "titles": "File:" + fname, "prop": "imageinfo",
        "iiprop": "url|size|extmetadata", "iiurlwidth": 960 if width <= 960 else 1280, "format": "json"})
    d = fetch("https://nl.wikipedia.org/w/api.php?" + q)
    page = next(iter(d["query"]["pages"].values()))
    if "imageinfo" not in page:
        print("MISSING", pid, fname); continue
    ii = page["imageinfo"][0]
    meta = {k: v.get("value") for k, v in ii.get("extmetadata", {}).items() if k in
            ("Artist", "LicenseShortName", "LicenseUrl", "ImageDescription", "DateTimeOriginal", "ObjectName", "Credit", "UsageTerms")}
    meta.update(file=fname, width=ii["width"], height=ii["height"], descriptionurl=ii["descriptionurl"])
    url = ii.get("thumburl") or ii["url"]
    if ii["width"] <= width: url = ii["url"]
    url = url.split("?")[0]
    try:
        img = Image.open(io.BytesIO(fetch(url, binary=True)))
    except Exception as e:
        print("FAILED", pid, e); continue
    img = img.convert("RGB")
    img.thumbnail((width, width))
    img.save(out, "JPEG", quality=82, progressive=True, optimize=True)
    json.dump(meta, open(os.path.join(metadir, pid + ".json"), "w"), indent=1)
    print("ok", pid, img.size, meta.get("LicenseShortName"), (meta.get("Artist") or "")[:60].replace("\n", " "))
    time.sleep(15)
