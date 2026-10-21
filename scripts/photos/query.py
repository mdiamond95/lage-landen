# Run Commons API queries on the GitHub runner when Commons rate-limits the machine the
# work is done on (searches, category listings, file metadata). Input: a JSON list of
# {"name": ..., "params": {...}, "pages": n}; each query's results, following `continue`
# for up to n pages, are saved to <outdir>/query-<name>.json. Delete the list and the
# results once read.
import json, os, sys, time, urllib.parse, urllib.request

UA = "LageLandenBot/1.0 (https://github.com/mdiamond95/lage-landen; mdiamond95)"
src, outdir = sys.argv[1], sys.argv[2]
os.makedirs(outdir, exist_ok=True)


def fetch(url):
    for _ in range(40):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=120) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            if e.code == 429:
                w = int(e.headers.get("retry-after", "30"))
                print("  429, waiting", w, file=sys.stderr)
                time.sleep(w + 5)
                continue
            raise
    raise RuntimeError("gave up " + url)


for q in json.load(open(src)):
    out = os.path.join(outdir, "query-" + q["name"] + ".json")
    if os.path.exists(out):
        continue
    params = {"action": "query", "format": "json", "formatversion": "2", **q["params"]}
    results, cont = [], {}
    for _ in range(q.get("pages", 1)):
        d = fetch("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({**params, **cont}))
        results.append(d.get("query", d))
        if "continue" not in d:
            break
        cont = d["continue"]
        time.sleep(2)
    json.dump(results, open(out, "w"), indent=1, ensure_ascii=False)
    print("ok", q["name"], len(results), "pages")
    time.sleep(3)
