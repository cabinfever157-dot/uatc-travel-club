#!/usr/bin/env python3
"""UATC batch image generation: for each prompt file, new chat (Ctrl+Shift+O),
inject, send, poll, download via page-context fetch. Usage: python gpt_image_batch.py"""
import json, asyncio, base64, websockets, urllib.request, os, sys, time

CDP_HTTP = "http://127.0.0.1:9222"
PROMPT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(PROMPT_DIR, "..", "public", "images", "gen")

JOBS = [
    ("02-tailgate-hero.txt", "uatc-hero-tailgate.png"),
    ("03-adventures.jpg.txt", "uatc-adventures.png"),
    ("04-stadium-night.txt", "uatc-stadium-night.png"),
    ("05-reunion.jpg.txt", "uatc-reunion.png"),
    ("06-branson.jpg.txt", "uatc-branson.png"),
    ("07-game-day.jpg.txt", "uatc-game-day.png"),
    ("08-weekend.jpg.txt", "uatc-weekend.png"),
]

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
        for pf, out in JOBS:
            outp = os.path.join(OUT_DIR, out)
            if os.path.exists(outp) and os.path.getsize(outp) > 10000:
                print(f"[{out}] already exists, skipping", flush=True)
                results[out] = "SKIP"
                continue
            prompt = open(os.path.join(PROMPT_DIR, pf), encoding="utf-8").read().strip()
            # new chat
            await cdp("Runtime.evaluate", {"expression":
                "document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'o',code:'KeyO',ctrlKey:true,shiftKey:true,bubbles:true}))"})
            await asyncio.sleep(2)
            # wait for fresh textbox
            for _ in range(10):
                r = await cdp("Runtime.evaluate", {"expression":
                    "(function(){var tb=document.querySelector('#prompt-textarea'); return tb ? 'OK' : 'WAIT';})()", "returnByValue": True})
                if r["result"]["value"] == "OK":
                    break
                await asyncio.sleep(1)
            # click+focus, inject, send
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
            print(f"[{out}] sent, polling...", flush=True)
            got = False
            for i in range(80):  # ~6.7 min per image
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
                print(f"[{out}] TIMEOUT/FAIL", flush=True)
                results[out] = "FAIL"
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
                print(f"[{out}] SAVED {len(data)}B", flush=True)
                results[out] = "OK"
            else:
                print(f"[{out}] DL-FAIL: {str(val)[:80]}", flush=True)
                results[out] = "DL-FAIL"
            await asyncio.sleep(2)
        print("BATCH SUMMARY:", json.dumps(results), flush=True)

asyncio.run(main())