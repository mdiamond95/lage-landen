# Run Overpass queries on the GitHub runner (Overpass refuses the machine the work is done on).
# Input: a JSON list of {"name": ..., "query": ...} in Overpass QL; each result is saved
# gzipped to <outdir>/<name>.json.gz. Delete the list and the results once the maps are built.
import gzip, json, os, sys, time, urllib.parse, urllib.request

UA = "LageLandenBot/1.0 (https://github.com/mdiamond95/lage-landen; mdiamond95)"
URLS = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"]
src, outdir = sys.argv[1], sys.argv[2]
os.makedirs(outdir, exist_ok=True)

for q in json.load(open(src)):
    out = os.path.join(outdir, q["name"] + ".json.gz")
    if os.path.exists(out):
        continue
    body = urllib.parse.urlencode({"data": q["query"]}).encode()
    for attempt in range(8):
        url = URLS[attempt % len(URLS)]
        try:
            req = urllib.request.Request(url, data=body, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=300) as r:
                data = r.read()
            json.loads(data)
            open(out, "wb").write(gzip.compress(data))
            print("ok", q["name"], len(data), "bytes from", url)
            break
        except Exception as e:
            print("  retry", q["name"], url, e, file=sys.stderr)
            time.sleep(30)
    else:
        print("FAILED", q["name"])
    time.sleep(10)
