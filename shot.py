import asyncio
from playwright.async_api import async_playwright

URL = "http://localhost:5174/"

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        c = await b.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
        page = await c.new_page()
        await page.goto(URL, wait_until="networkidle", timeout=30000)
        await page.wait_for_timeout(500)

        # Check for errors in console
        h = await page.evaluate("document.body.scrollHeight")
        print("body height:", h)

        title = await page.title()
        print("title:", title)

        # Top of page
        await page.screenshot(path="01-top.png", full_page=False)

        # Scroll through page and capture each section
        viewport_h = 900
        sections = [
            ("02-hero-bottom.png", 400),
            ("03-workspace.png", 1400),
            ("04-workspace2.png", 2100),
            ("05-tracks.png", 2800),
            ("06-loop.png", 3500),
            ("07-companies.png", 4200),
            ("08-cert.png", 4900),
            ("09-final.png", 5600),
        ]
        for name, y in sections:
            await page.evaluate(f"window.scrollTo(0, {y})")
            await page.wait_for_timeout(600)
            await page.screenshot(path=name, full_page=False)
            print("captured", name, "at scroll", y)

        # Full page
        await page.evaluate("window.scrollTo(0, 0)")
        await page.wait_for_timeout(500)
        await page.screenshot(path="00-full.png", full_page=True)
        print("captured full page")

        # Check for any visible overlapping text by reading hero
        hero_text = await page.evaluate("""() => {
            const h1 = document.querySelector('h1');
            if (!h1) return 'NO H1 FOUND';
            const r = h1.getBoundingClientRect();
            return { text: h1.innerText, top: r.top, height: r.height, width: r.width };
        }""")
        print("hero:", hero_text)

        await b.close()

asyncio.run(main())
