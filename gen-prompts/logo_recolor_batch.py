#!/usr/bin/env python3
"""UATC logo recolor batch: 12 tiles via ChatGPT image edit. Reference: uatc-logo.png.
Per tile: new chat, upload ref? No - upload via CDP is fragile; instead prompt-only
regeneration with exact description + hex colors, then post-verify colors."""
import json, asyncio, base64, websockets, urllib.request, os, sys

CDP_HTTP = "http://127.0.0.1:9222"
HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "..", "public", "images", "gen", "logos")

TILES = [
    ("tile01", "#8E1838", "#F4E7C5", "crimson red banners + cream lettering"),
    ("tile02", "#102A43", "#E2B84A", "navy banners + warm gold accents"),
    ("tile03", "#C95724", "#245A9A", "burnt orange banners + royal blue accents"),
    ("tile04", "#1F5A3A", "#E4C43E", "forest green banners + golden yellow accents"),
    ("tile05", "#70A9D2", "#F7F5EF", "powder blue banners + warm white accents"),
    ("tile06", "#6F2338", "#B8BDC3", "burgundy banners + silver accents"),
    ("tile07", "#512D6D", "#D5A940", "deep purple banners + old gold accents"),
    ("tile08", "#D62832", "#202124", "bright red banners + charcoal accents"),
    ("tile09", "#191919", "#D0A43A", "black banners + athletic gold accents"),
    ("tile10", "#2456A6", "#F4F2EA", "royal blue banners + ivory accents"),
    ("tile11", "#7C2638", "#C8A45C", "garnet banners + sand gold accents"),
    ("tile12", "#D76A28", "#17634A", "orange banners + deep green accents"),
]

PROMPT_TMPL = """Recolor this exact shield-style collegiate patch logo. KEEP the composition, shapes, banner curves, lettering ("UNIVERSITY" top, "ALUMNI" center block letters, "TRAVEL CLUB" bottom), graduation cap, globe with grid lines, and silver sticker-style outer border all IDENTICAL to the reference. Change ONLY the colors:

- The two curved banners + graduation cap + globe fill: {primary} (primary color)
- The varsity letter outlines, globe grid lines, tassel, and small detail strokes: {secondary} (secondary color)
- Letter interiors stay cream/off-white; the central shield field stays black; silver outer sticker border stays gray-silver.

Output: the same square emblem, flat vector style, on a plain white background, no text changes, no layout changes. Colors must read clearly at small sizes."""

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
        for name, prim, sec, desc in TILES:
            outp = os.path.join(OUT_DIR, f"logo-{name}.png")
            if os.path.exists(outp) and os.path.getsize(outp) > 10000:
                print(f"[{name}] exists, skip", flush=True)
                results[name] = "SKIP"
                continue
            prompt = PROMPT_TMPL.format(primary=prim, secondary=sec)
            # new chat
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
            print(f"[{name}] sent ({prim} + {sec}), polling...", flush=True)
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