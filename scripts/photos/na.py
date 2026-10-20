# Fetch photos from the Nationaal Archief's photo collection, the source of the Anefo,
# Elsevier, Rijksvoorlichtingsdienst and Spaarnestad photos on Wikimedia Commons. Useful
# when Commons is rate-limiting: the file is the same, and the credit still points at
# its Commons page.
#
#   python3 scripts/photos/na.py search "Draden des Doods"
#       lists matching records: object id and description.
#   python3 scripts/photos/na.py fetch list.tsv src/photos
#       list.tsv holds id<TAB>object id<TAB>max width; saves <id>.jpg (progressive JPEG).
#
# The object id is the uuid in a Commons file's source link
# (http://proxy.handle.net/10648/<uuid>), or one found with `search`.
import io, json, os, re, sys, time, urllib.parse, urllib.request
from PIL import Image

UA = "LageLandenBot/1.0 (https://github.com/mdiamond95/lage-landen; mdiamond95)"


def get(url, binary=False):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=120) as r:
        data = r.read()
    return data if binary else data.decode("utf-8")


def search(q):
    d = json.loads(get("https://hub3.nationaalarchief.nl/api/search/v2?q=" + urllib.parse.quote(q)))
    for it in d.get("items", []):
        s = it.get("summary")
        if s and s.get("objectID"):
            print(s["objectID"], "|", s.get("description", "")[:160])


def files(object_id):
    page = get(f"https://www.nationaalarchief.nl/onderzoeken/fotocollectie/{object_id}?tab=download")
    text = page.replace("\\u0022", '"').replace("\\/", "/")
    return re.findall(r'\{"view":"(\w+)","filename":"[^"]*","fileuuid":"([0-9a-f-]{36})"', text)


def fetch(listing, outdir):
    for line in open(listing):
        if not line.strip() or line.startswith("#"):
            continue
        pid, object_id, width = (line.rstrip("\n").split("\t") + ["880"])[:3]
        out = os.path.join(outdir, pid + ".jpg")
        if os.path.exists(out):
            continue
        try:
            found = files(object_id)
        except Exception as e:
            print("FAILED", pid, object_id, e)
            continue
        jpegs = [u for view, u in found if view == "JPEG"] or [u for _, u in found]
        if not jpegs:
            print("NOFILE", pid, object_id)
            continue
        data = get(f"https://service.archief.nl/gaf/api/file/v1/default/{jpegs[0]}", binary=True)
        img = Image.open(io.BytesIO(data)).convert("RGB")
        img.thumbnail((int(width), int(width)))
        img.save(out, "JPEG", quality=82, progressive=True, optimize=True)
        print("ok", pid, img.size)
        time.sleep(2)


if __name__ == "__main__":
    if sys.argv[1] == "search":
        search(" ".join(sys.argv[2:]))
    else:
        fetch(sys.argv[2], sys.argv[3])
