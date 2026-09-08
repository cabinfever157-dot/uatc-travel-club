#!/usr/bin/env python3
"""UATC visual verification — full-page + section screenshots + console errors."""
from playwright.sync_api import sync_playwright
import os, json

OUT = r"C:\Projects\uatc\verify"
os.makedirs(OUT, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    errors = []
    page.on("console", lambda m: errors.append(f"[{m.type}] {m.text}") if m.type in ("error", "warning") else None)
    page.on("pageerror", lambda e: errors.append(f"[pageerror] {e}"))

    page.goto("http://127.0.0.1:3002", wait_until="networkidle", timeout=60000)
    page.wait_for_timeout(3500)

    # hero screenshot
    page.screenshot(path=os.path.join(OUT, "01-hero.png"))

    # console errors after load
    print("CONSOLE:", json.dumps(errors[:10], indent=1) if errors else "CLEAN")

    # check key elements present
    checks = {}
    for sel, name in [
        ("nav", "nav present"),
        ("h1", "h1 present"),
    ]:
        checks[name] = page.locator(sel).count() > 0

    # scroll through each section, screenshot
    sections = ["follow", "adventures", "savings", "how"]
    for i, sid in enumerate(sections):
        page.eval_on_selector(f"#{sid}", "el => el.scrollIntoView({block:'start'})")
        page.wait_for_timeout(2600)
        page.screenshot(path=os.path.join(OUT, f"0{i+2}-{sid}.png"))

    # full page
    page.screenshot(path=os.path.join(OUT, "full-page.png"), full_page=True)

    # mobile spot check
    m = browser.new_page(viewport={"width": 390, "height": 844})
    m.goto("http://127.0.0.1:3002", wait_until="networkidle", timeout=60000)
    m.wait_for_timeout(2500)
    m.screenshot(path=os.path.join(OUT, "mobile-hero.png"))
    m.errors_list = []
    browser.close()

print("SHOTS SAVED to", OUT)
for f in sorted(os.listdir(OUT)):
    print(" -", f)