import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

mkdirSync('./audit-shots', { recursive: true });

const widths = [
  { name: 'iPhone-SE', w: 375, h: 667 },
  { name: 'iPhone-14-Pro', w: 393, h: 852 },
  { name: 'iPad-mini', w: 768, h: 1024 },
];

const pages = [
  { name: 'landing', url: 'https://www.dreamclerk.com/' },
  { name: 'blog-post', url: 'https://www.dreamclerk.com/blog/fresher-unemployment-india-2026-the-numbers-and-the-fix' },
  { name: 'blog-list', url: 'https://www.dreamclerk.com/blog' },
];

const browser = await chromium.launch({
  executablePath: 'C:/Users/arjun/AppData/Local/ms-playwright/chromium-1208/chrome-win64/chrome.exe',
});
const results = [];

for (const v of widths) {
  for (const p of pages) {
    const context = await browser.newContext({ viewport: { width: v.w, height: v.h }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    try {
      const resp = await page.goto(p.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout;
      const file = `./audit-shots/${v.name}-${p.name}.png`;
      await page.screenshot({ path: file, fullPage: false });

      const checks = await page.evaluate(() => {
        const out = {};
        out.bodyScrollW = document.body.scrollWidth;
        out.docScrollW = document.documentElement.scrollWidth;
        out.viewportW = window.innerWidth;
        out.hasHScroll = document.documentElement.scrollWidth > window.innerWidth + 1;

        // Nav checks
        const hamburger = document.querySelector('[class*="hamburger" i], button[aria-label*="menu" i], button[aria-label*="Menu" i], [class*="menu-btn" i], [class*="MenuToggle" i], [class*="menu-toggle" i], button[aria-controls*="menu" i]');
        out.hamburgerFound = !!hamburger;
        out.hamburgerVisible = !!(hamburger && hamburger.offsetParent !== null);
        if (hamburger) {
          const r = hamburger.getBoundingClientRect();
          out.hamburgerRect = { w: r.width, h: r.height, x: r.x, y: r.y };
        }

        const ctaApply = Array.from(document.querySelectorAll('a, button')).find(el => {
          const t = (el.textContent || '').trim();
          return /^apply$/i.test(t) || /^apply\s*$/i.test(t);
        });
        out.applyFound = !!ctaApply;
        out.applyVisible = !!(ctaApply && ctaApply.offsetParent !== null);
        if (ctaApply) {
          const r = ctaApply.getBoundingClientRect();
          out.applyRect = { w: r.width, h: r.height, x: r.x, y: r.y };
        }

        const statusChip = Array.from(document.querySelectorAll('*')).find(el => {
          const t = (el.textContent || '').trim();
          return /systems?\s*normal/i.test(t) && el.children.length < 5 && el.offsetParent !== null;
        });
        out.systemsNormalFound = !!statusChip;
        if (statusChip) {
          const r = statusChip.getBoundingClientRect();
          out.systemsNormalVisible = r.width > 0 && r.height > 0;
          out.systemsNormalRect = { w: r.width, x: r.x };
        }

        // Hero
        const h1 = document.querySelector('h1');
        if (h1) {
          const r = h1.getBoundingClientRect();
          out.h1Rect = { w: r.width, right: r.right, h: r.height };
          out.h1FontSize = parseFloat(getComputedStyle(h1).fontSize);
          out.h1Overflow = r.right > window.innerWidth + 1;
        }

        // Code blocks (blog post)
        const codes = Array.from(document.querySelectorAll('pre, code'));
        out.codeBlocks = codes.length;
        let codeOverflows = 0;
        codes.forEach(c => {
          if (c.scrollWidth > c.clientWidth + 2) codeOverflows++;
        });
        out.codeOverflows = codeOverflows;

        // Body font
        out.bodyFontSize = parseFloat(getComputedStyle(document.body).fontSize);
        out.htmlFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

        // Ticker / marquee
        const marquees = document.querySelectorAll('[class*="marquee" i], [class*="ticker" i]');
        out.marquees = marquees.length;
        marquees.forEach((m, i) => {
          out[`marquee${i}W`] = m.scrollWidth;
          out[`marquee${i}CW`] = m.clientWidth;
          out[`marquee${i}Overflow`] = m.scrollWidth > m.clientWidth + 2;
        });

        // Long word overflow
        const proselike = document.querySelectorAll('p, h1, h2, h3, h4, li');
        let longWordOverflow = 0;
        proselike.forEach(el => {
          if (el.scrollWidth > el.clientWidth + 2) longWordOverflow++;
        });
        out.proseElements = proselike.length;
        out.proseOverflow = longWordOverflow;

        return out;
      });

      results.push({ viewport: v.name, page: p.name, status: resp ? resp.status() : 'no-resp', file, checks });
      console.log(`OK ${v.name} ${p.name} (status ${resp ? resp.status() : '?'}) -> ${file}`);
    } catch (e) {
      results.push({ viewport: v.name, page: p.name, error: e.message });
      console.log(`ERR ${v.name} ${p.name}: ${e.message}`);
    }
    await context.close();
  }
}

await browser.close();
console.log('\n=== RESULTS ===');
console.log(JSON.stringify(results, null, 2));
