#!/usr/bin/env python3
"""UATC GPT image generation driver.
Per image: inject prompt into ChatGPT via CDP, send, poll stop-button gone +
estuary img present, download via fresh-Image canvas trick, save to public/images/gen/.
Usage: python gpt_image_gen.py <prompt_file> <out_name>
"""
import asyncio, json, sys, base64, os, time

WS = None
import websockets  # type: ignore

CDP_HTTP = "http://127.0.0.1:9222"

async def get_ws():
    import urllib.request
    with urllib.request.urlopen(CDP_HTTP + "/json/list", timeout=10) as r:
        pages = json.load(r)
    for p in pages:
        if p.get("type") == "page" and "chatgpt" in p.get("url", ""):
            return p["webSocketDebuggerUrl"]
    raise RuntimeError("no chatgpt tab")

async def cdp(ws, method, params=None, mid=[0]):
    mid[0] += 1
    msg = {"id": mid[0], "method": method, "params": params or {}}
    await ws.send(json.dumps(msg))
    while True:
        resp = json.loads(await asyncio.wait_for(ws.recv(), 120))
        if resp.get("id") == mid[0]:
            return resp.get("result", {})

def esc(s):
    return s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")

async def main():
    prompt_file, out_name = sys.argv[1], sys.argv[2]
    prompt = open(prompt_file, encoding="utf-8").read().strip()
    ws_url = await get_ws()
    async with websockets.connect(ws_url, max_size=50 * 1024 * 1024) as ws:
        # click + focus textbox first (mandatory)
        await cdp(ws, "Runtime.evaluate", {"expression":
            "(function(){var tb=document.querySelector('#prompt-textarea'); if(!tb) return 'NO_TB'; tb.click(); tb.focus(); return 'FOCUSED';})()"})
        # chunked injection
        chunks = [prompt[i:i+1200] for i in range(0, len(prompt), 1200)]
        js_parts = " + ".join(f"'{esc(c)}'" for c in chunks)
        await cdp(ws, "Runtime.evaluate", {"expression":
            f"(function(){{var tb=document.querySelector('#prompt-textarea'); tb.textContent = {js_parts};"
            f"tb.dispatchEvent(new Event('input',{{bubbles:true}})); return tb.textContent.length;}})()"})
        await asyncio.sleep(1)
        await cdp(ws, "Runtime.evaluate", {"expression":
            "(function(){var b=document.querySelector('[aria-label=\"Send prompt\"]'); if(b){b.click(); return 'SENT';} return 'NO_SEND';})()"})
        print(f"[{out_name}] sent, polling...", flush=True)
        # poll: stop-button gone AND estuary img present
        for i in range(90):  # up to ~7.5 min
            await asyncio.sleep(5)
            r = await cdp(ws, "Runtime.evaluate", {"expression":
                "(function(){var sb=document.querySelector('[data-testid=\"stop-button\"]');"
                "var imgs=Array.from(document.querySelectorAll('img')).filter(function(m){return m.src && m.src.indexOf('estuary')>-1;});"
                "return JSON.stringify({busy: !!sb, estuary: imgs.length, srcs: imgs.map(function(m){return m.src;}).slice(-4)});})()",
                "returnByValue": True})
            try:
                st = json.loads(r["result"]["value"])
            except Exception:
                continue
            if not st["busy"] and st["estuary"] > 0 and i > 1:
                print(f"[{out_name}] generation complete after {(i+1)*5}s, {st['estuary']} estuary imgs", flush=True)
                # download via fresh Image canvas
                dl = await cdp(ws, "Runtime.evaluate", {"expression":
                    "(async function(){var imgs=document.querySelectorAll('img');var src='';"
                    "for(var i=0;i<imgs.length;i++){if(imgs[i].src.indexOf('estuary')>-1){src=imgs[i].src;break;}}"
                    "if(!src) return 'NO_SRC';"
                    "var img=new Image();img.crossOrigin='anonymous';img.src=src;"
                    "await new Promise(function(res,rej){img.onload=res;img.onerror=rej;setTimeout(rej,30000);});"
                    "var c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;"
                    "var x=c.getContext('2d');x.drawImage(img,0,0);"
                    "return JSON.stringify({w:c.width,h:c.height,url:src});})()",
                    "returnByValue": True, "awaitPromise": True}, mid=[1000])
                info = json.loads(dl["result"]["value"])
                print(f"[{out_name}] img {info['w']}x{info['h']} -> {info['url'][:60]}", flush=True)
                # fetch via curl from python (canvas toDataURL too big through CDP sometimes; use urllib on the URL)
                import urllib.request
                outdir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "images", "gen")
                os.makedirs(outdir, exist_ok=True)
                outp = os.path.join(outdir, out_name)
                req = urllib.request.Request(info["url"], headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req, timeout=60) as resp, open(outp, "wb") as f:
                    f.write(resp.read())
                print(f"[{out_name}] SAVED -> {outp}", flush=True)
                return 0
        print(f"[{out_name}] TIMEOUT", flush=True)
        return 1

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))