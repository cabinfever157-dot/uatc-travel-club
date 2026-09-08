#!/usr/bin/env python3
"""UATC Warhol grid v2: 12 DISTINCT collegiate crest designs, each in its own
school color pair (Big Man's 12 tiles). Prompt-only generation per tile.
Output: public/images/gen/logos/logo-tileNN.png"""
import json, asyncio, base64, websockets, urllib.request, os

CDP_HTTP = "http://127.0.0.1:9222"
HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "..", "public", "images", "gen", "logos")

# (name, primary, secondary, distinct design brief)
TILES = [
    ("tile01", "#8E1838", "#F4E7C5", "shield with laurel wreath sides, open book center, ribbon banner below"),
    ("tile02", "#102A43", "#E2B84A", "round seal with graduation cap above an open book, ring text band, stars"),
    ("tile03", "#C95724", "#245A9A", "quad-split shield: cap, torch, book, star in four panels"),
    ("tile04", "#1F5A3A", "#E4C43E", "circular wreath enclosing a classical columned building with pediment"),
    ("tile05", "#70A9D2", "#F7F5EF", "vertical shield with crown at top, open book center, banner below"),
    ("tile06", "#6F2338", "#B8BDC3", "crested shield with a torch flame center, laurel branches crossed beneath"),
    ("tile07", "#512D6D", "#D5A940", "oval badge with globe + orbit ring, open book at base, star above"),
    ("tile08", "#D62832", "#202124", "shield with wings on both sides, football center, bold banner across top"),
    ("tile09", "#191919", "#D0A43A", "hex crest with classical columned building, laurels, small stars"),
    ("tile10", "#2456A6", "#F4F2EA", "circular seal with lighthouse tower, ribbon banner across center"),
    ("tile11", "#7C2638", "#C8A45C", "coat-of-arms shield with three stars above, quartered panels, ribbon"),
    ("tile12", "#D76A28", "#17634A", "shield with winged wheel center, laurel wreath below, banner beneath"),
]

PROMPT_TMPL = """Design a collegiate university patch/crest emblem for "UNIVERSITY ALUMNI TRAVEL CLUB" in vintage sports-team style. This is design variant {n} of 12 — each variant has a DIFFERENT composition.

COMPOSITION (this variant): {composition}
Text: "UNIVERSITY" on a top banner, "ALUMNI" in large varsity block letters center, "TRAVEL CLUB" on a bottom banner. Varsity serif lettering with thick outlines.

COLORS: primary {primary} for banners/shield field/main icons, secondary {secondary} for letter outlines, grid strokes and detail accents, cream/off-white letter interiors. Silver-gray sticker-style outer border around the whole emblem.

Flat vector style, high contrast, legible at small sizes, plain white background, square composition, centered emblem. No watermark, no extra words beyond the three text lines."""

def esc(s):
    return s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")

async def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    with urllib.request.urlopen(CDP_HTTP + "/json/list", timeout=10) as r:
        pages = json.load(r)
    ws_url = [p["webSocketDebuggerUrl"] for p in pages if p.get("type") == "page" and "chatgpt" in p.get("url", "")][0]
    async with websockets.connect(ws_url, max_size=100 * 1024 * 1024) as ws:
        mid = [0]
        async def cdp(method, params=None):
            mid[0] += 1
            await ws.send(json.dumps({"id": mid[0], "method": method, "params": params or {}}))
            while True:
                resp = json.loads(await asyncio.wait_for(ws.recv(), 300))
                if resp.get("id") == mid[0]:
                    return resp.get("result", {})
        results = {}
        for name, prim, sec, brief in TILES:
            outp = os.path.join(OUT_DIR, f"logo-{name}.png")
            if os.path.exists(outp) and os.path.getsize(outp) > 10000:
                print(f"[{name}] exists, skip", flush=True)
                results[name] = "SKIP"
                continue
            prompt = PROMPT_TMPL.format(n=TILES.index((name, prim, sec, brief)) + 1, primary=prim, secondary=sec, composition=brief)
            await cdp("Runtime.evaluate", {"expression":
                "document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'o',code:'KeyO',ctrlKey:true,shiftKey:true,bubbles:true}))"})
            await asyncio.sleep(2.5)
            for _ in range(10):
                r = await cdp("Runtime.evaluate", {"expression":
                    "(function(){var tb=document.querySelector('#prompt-textarea'); return tb ? 'OK' : 'WAIT';})()", "returnByValue": True})
                if r["result"]["value"] == "OK":
                    break
                await asyncio.sleep(1)
            await cdp("Runtime.evaluate", {"expression":
                "(function(){var tb=document.querySelector('#prompt-textarea'); tb.click(); tb.focus(); return 1;})()"})
            chunks = [prompt[i:i+1200] for i in range(0, len(prompt), 1200)]
            js_parts = " + ".join(f"'{esc(c)}'" for c in chunks)
            await cdp("Runtime.evaluate", {"expression":
                f"(function(){{var tb=document.querySelector('#prompt-textarea'); tb.textContent = {js_parts};"
                f"tb.dispatchEvent(new Event('input',{{bubbles:true}})); return tb.textContent.length;}})()"})
            await asyncio.sleep(1.2)
            await cdp("Runtime.evaluate", {"expression":
                "(function(){var b=document.querySelector('[aria-label=\"Send prompt\"]'); if(b){b.click(); return 'SENT';} return 'NO_SEND';})()"})
            print(f"[{name}] sent ({prim} + {sec} | {brief[:40]}...), polling...", flush=True)
            got = False
            for i in range(80):
                await asyncio.sleep(5)
                r = await cdp("Runtime.evaluate", {"expression":
                    "(function(){var sb=document.querySelector('[data-testid=\"stop-button\"]');"
                    "var imgs=Array.from(document.querySelectorAll('img')).filter(function(m){return m.src&&m.src.indexOf('estuary')>-1;});"
                    "return JSON.stringify({busy:!!sb,n:imgs.length});})()", "returnByValue": True})
                try:
                    st = json.loads(r["result"]["value"])
                except Exception:
                    continue
                if not st["busy"] and st["n"] > 0 and i >= 1:
                    got = True
                    break
            if not got:
                print(f"[{name}] TIMEOUT/FAIL", flush=True)
                results[name] = "FAIL"
                continue
            await asyncio.sleep(3)
            r = await cdp("Runtime.evaluate", {"expression":
                "(async function(){var imgs=document.querySelectorAll('img');var src='';"
                "for(var i=imgs.length-1;i>=0;i--){if(imgs[i].src.indexOf('estuary')>-1){src=imgs[i].src;break;}}"
                "if(!src) return 'NO_SRC';"
                "var resp=await fetch(src,{credentials:'include'});"
                "var blob=await resp.blob();"
                "var b64=await new Promise(function(res,rej){var fr=new FileReader();fr.onload=function(){res(fr.result)};fr.onerror=rej;fr.readAsDataURL(blob);});"
                "return b64;})()",
                "returnByValue": True, "awaitPromise": True})
            val = r["result"].get("value", "")
            if isinstance(val, str) and val.startswith("data:"):
                data = base64.b64decode(val.split(",", 1)[1])
                with open(outp, "wb") as f:
                    f.write(data)
                print(f"[{name}] SAVED {len(data)}B", flush=True)
                results[name] = "OK"
            else:
                print(f"[{name}] DL-FAIL: {str(val)[:80]}", flush=True)
                results[name] = "DL-FAIL"
            await asyncio.sleep(2)
        print("BATCH SUMMARY:", json.dumps(results), flush=True)

asyncio.run(main())