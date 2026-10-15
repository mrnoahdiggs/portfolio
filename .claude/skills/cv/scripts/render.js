// Render a CV page to PDF and report how much room each column has left.
// Usage (from the repo root): NODE_PATH=$(npm root -g) node .claude/skills/cv/scripts/render.js [cv/file.html] [--png outDir]
// Defaults to cv/index.html. The PDF goes next to the HTML, named by its <meta name="pdf-filename">.
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '../../../..');
const args = process.argv.slice(2);
const pngIdx = args.indexOf('--png');
const pngDir = pngIdx > -1 ? path.resolve(args[pngIdx + 1]) : null;
const input = args.find((a, i) => a.endsWith('.html') && i !== pngIdx + 1) || 'cv/index.html';
const html = path.resolve(root, input);
const PX_PER_MM = 96 / 25.4;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file://' + html);
  await page.evaluate(() => document.fonts.ready);
  const pdfName = await page.evaluate(() => document.querySelector('meta[name="pdf-filename"]')?.content);
  if (!pdfName) throw new Error('add <meta name="pdf-filename" content="Name.pdf"> to ' + input);
  const pdf = path.join(path.dirname(html), pdfName);

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
      const out = path.join(pngDir, `${path.basename(pdf, '.pdf')}-page-${i + 1}.png`);
      await els[i].screenshot({ path: out });
      console.log('wrote ' + out);
    }
  }
  await browser.close();
  process.exit(ok ? 0 : 1);
})();
