#!/usr/bin/env python3
"""Download the latest estuary image from the open ChatGPT tab via page-context fetch (cookies included).
Usage: python gpt_image_dl.py <out_path>
"""
import json, sys, asyncio, base64, websockets, urllib.request, os

CDP_HTTP = "http://127.0.0.1:9222"

async def main():
    out_path = sys.argv[1]
    with urllib.request.urlopen(CDP_HTTP + "/json/list", timeout=10) as r:
        pages = json.load(r)
    ws_url = [p["webSocketDebuggerUrl"] for p in pages if p.get("type") == "page" and "chatgpt" in p.get("url", "")][0]
    async with websockets.connect(ws_url, max_size=100 * 1024 * 1024) as ws:
        mid = [0]
        async def cdp(method, params=None):
            mid[0] += 1
            await ws.send(json.dumps({"id": mid[0], "method": method, "params": params or {}}))
            while True:
                resp = json.loads(await asyncio.wait_for(ws.recv(), 180))
                if resp.get("id") == mid[0]:
                    return resp.get("result", {})
        r = await cdp("Runtime.evaluate", {"expression":
            "(async function(){var imgs=document.querySelectorAll('img');var src='';"
            "for(var i=imgs.length-1;i>=0;i--){if(imgs[i].src.indexOf('estuary')>-1){src=imgs[i].src;break;}}"
            "if(!src) return 'NO_SRC';"
            "var resp=await fetch(src,{credentials:'include'});"
            "var blob=await resp.blob();"
            "var b64=await new Promise(function(res,rej){var fr=new FileReader();fr.onload=function(){res(fr.result)};fr.onerror=rej;fr.readAsDataURL(blob);});"
            "return b64;})()",
            "returnByValue": True, "awaitPromise": True})
        val = r["result"]["value"]
        if val == "NO_SRC" or not isinstance(val, str) or not val.startswith("data:"):
            print("DL FAILED:", str(val)[:200]); return 1
        b64 = val.split(",", 1)[1]
        data = base64.b64decode(b64)
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
        with open(out_path, "wb") as f:
            f.write(data)
        print(f"SAVED {len(data)} bytes -> {out_path}")
        return 0

if __name__ == "__main__":
    sys.exit(asyncio.run(main()))