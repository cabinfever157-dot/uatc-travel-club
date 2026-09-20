"""Swap main logo to Damon's attached cap-over-globe shield (transparent bg),
then strip white backgrounds from all 12 grid crests. Delete replaced olds."""
from PIL import Image
import os, shutil

SRC_NEW_LOGO = r"C:\Users\info\AppData\Local\hermes\images\clip_20260908_142841_6.png"
CREST = r"C:/Projects/uatc/public/images/uatc-crest.png"
LOGO_DIR = r"C:/Projects/uatc/public/images/gen/logos"

def strip_white(img: Image.Image, hard=244, feather_lo=230) -> Image.Image:
    """Make near-white pixels transparent with feathered edges.
    Uses distance-from-white; cream letter interiors (b channel ~200) stay opaque."""
    rgba = rgba = img.convert("RGBA")
    px = rgba.load()
    W, H = rgba.size
    for y in range(H):
        for x in range(W):
            r, g, b, a = px[x, y]
            d = ((255 - r) ** 2 + (255 - g) ** 2 + (255 - b) ** 2) ** 0.5
            if d <= 8:
                px[x, y] = (r, g, b, 0)
            elif d < 40:
                # antialiased edge — feather alpha proportionally
                t = (d - 12) / (hard - 12)
                t = max(0.0, min(1.0, t))
                px[x, y] = (r, g, b, int(a * t))
    return rgba

# 1) main logo: replace with the newly attached cap-over-globe shield
new_logo = Image.open(r"C:\Users\info\AppData\Local\hermes\images\clip_20260908_142841_6.png")
new_logo_t = Image.new("RGBA", new_logo.size, (0, 0, 0, 0))
# trim plain-white margin first
new_logo = new_logo.convert("RGBA")
W, H = new_logo.size
px = new_logo.load()
minx, miny, maxx, maxy = W, H, 0, 0
for yy in range(0, H, 2):
    for xx in range(0, W, 2):
        r, g, b, aa = px[xx, yy]
        if aa > 30 and not (r > 238 and g > 234 and b > 226):
            if xx < minx: minx = xx
            if xx > maxx: maxx = xx
            if yy < miny: miny = yy
            if yy > maxy: maxy = yy
pad = 10
l = max(0, minx - pad); t = max(0, miny - pad); r_ = min(W, maxx + pad); b_ = min(H, maxy + pad)
crest = new_logo.crop((l := l_, t, r_, b_)) if False else new_logo.crop((l, t, r_, b_))
crest_t = strip_white(crest)
side = max(crest_t.size)
canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
canvas.paste(crest_t, ((side - crest_t.width) // 2, (side - crest_t.height) // 2), crest_t)
canvas.save(CREST)
print("uatc-crest.png replaced with attached logo (transparent)")
# favicon from same crest
canvas.resize((256, 256), Image.LANCZOS).save(r"C:/Projects/uatc/app/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (256, 256)])
print("favicon replaced")

# 2) strip white bg from the 12 grid crests (in place)
d = r"C:/Projects/uatc/public/images/gen/logos"
for f in sorted(os.listdir(d)):
    if f.startswith("logo-tile") and f.endswith(".png"):
        p = os.path.join(d, f)
        img = strip_white(Image.open(p))
        img.save(p)
        print(f"{f}: white -> transparent")

# 3) delete the replaced old logo (earlier crest file was uatc-logo.png staging copy)
old = r"C:/Projects/uatc/public/images/uatc-logo.png"
if os.path.exists(old):
    os.remove(old)
    print("deleted replaced old: public/images/uatc-logo.png")
print("DONE")