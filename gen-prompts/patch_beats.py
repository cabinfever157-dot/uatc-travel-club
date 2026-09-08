from playwright.sync_api import sync_playwright

beats = [(650, "650ms-flight"), (1150, "1150ms-impact"), (1950, "1950ms-flipwave"), (2700, "2700ms-settled")]
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1440, "height": 900})
    pg.goto("http://localhost:3001", wait_until="domcontentloaded")
    last = 0
    for ms, name in beats:
        pg.wait_for_timeout(ms - last)
        last = ms
        pg.screenshot(path=f"verify/patch-{name}.png")
    b.close()
print("4 beats captured")