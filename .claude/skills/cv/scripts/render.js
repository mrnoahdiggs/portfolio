// Render cv/index.html to cv/Noah-Diggs-CV.pdf and report how much room each column has left.
// Usage (from the repo root): NODE_PATH=$(npm root -g) node .claude/skills/cv/scripts/render.js [--png outDir]
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '../../../..');
const html = path.join(root, 'cv/index.html');
const pdf = path.join(root, 'cv/Noah-Diggs-CV.pdf');
const pngIdx = process.argv.indexOf('--png');
const pngDir = pngIdx > -1 ? path.resolve(process.argv[pngIdx + 1]) : null;
const PX_PER_MM = 96 / 25.4;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + html);
  await page.evaluate(() => document.fonts.ready);

  // Space between the last block in each column and the footer. Negative = overflowing (text is clipped).
  const pages = await page.evaluate(() => [...document.querySelectorAll('.page')].map(pg => {
    const foot = pg.querySelector('footer').getBoundingClientRect().top;
    return [...pg.querySelectorAll('main, aside')].map(col => ({
      col: col.tagName.toLowerCase(),
      spare: foot - col.lastElementChild.getBoundingClientRect().bottom,
    }));
  }));

  let ok = pages.length === 2;
  pages.forEach((cols, i) => cols.forEach(c => {
    const mm = c.spare / PX_PER_MM;
    if (mm < 0) ok = false;
    console.log(`page ${i + 1} ${c.col.padEnd(5)} spare ${mm.toFixed(1).padStart(6)} mm${mm < 0 ? '  <-- OVERFLOW' : ''}`);
  }));
  if (pages.length !== 2) console.log(`expected 2 pages, found ${pages.length}`);

  await page.pdf({ path: pdf, preferCSSPageSize: true, printBackground: true });
  console.log('wrote ' + path.relative(root, pdf));

  if (pngDir) {
    await page.setViewportSize({ width: 900, height: 1200 });
    const els = await page.$$('.page');
    for (let i = 0; i < els.length; i++) {
      const out = path.join(pngDir, `cv-page-${i + 1}.png`);
      await els[i].screenshot({ path: out });
      console.log('wrote ' + out);
    }
  }
  await browser.close();
  process.exit(ok ? 0 : 1);
})();
