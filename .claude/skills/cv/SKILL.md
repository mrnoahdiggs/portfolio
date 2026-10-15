---
name: cv
description: How Noah Diggs' printable 2-page A4 CV (cv/index.html → cv/Noah-Diggs-CV.pdf) is built, styled and checked. Use whenever editing the CV's content, layout, fonts, colours or QR code, re-exporting the PDF, or making a variant of it (a one-page version, a tailored CV for a specific school, a cover letter in the same style).
---

# Printable CV

The CV is one hand-written HTML file that prints to exactly **two A4 pages**. The PDF is the
deliverable; the HTML is its source. It is printed for in-person recruitment fairs, so every
choice favours paper: sturdy fonts, high-contrast text, and a QR code big enough to scan from
across a table.

```
cv/
  index.html            source: all markup and CSS in one file (no build step, no external requests)
  Noah-Diggs-CV.pdf     print-ready export, committed: re-export after every change
  qr-code.png           QR code (900×900, cropped from Noah's branded original, quiet zone kept)
  fonts/*.woff2         self-hosted fonts (Lora, Lora italic, Source Sans 3, Source Sans 3 italic)
.claude/skills/cv/scripts/
  render.js             exports the PDF and reports spare room per column; optional PNG previews
  contrast.py           contrast ratio of every colour token on white and on the side panel
```

## Workflow for any change

1. Edit `cv/index.html`.
2. Render and check fit:
   ```bash
   NODE_PATH=$(npm root -g) node .claude/skills/cv/scripts/render.js --png <scratch-dir>
   ```
   It prints the space left under each column in mm and exits non-zero if any column
   overflows or the page count isn't 2. Pages are fixed-height with `overflow: hidden`, so
   **overflowing text is silently clipped, not pushed to a new page**. Always read this report.
3. Look at the PNGs (or `pdftoppm -r 70 -png cv/Noah-Diggs-CV.pdf <dir>/pg`). Check line wraps
   by eye: stat numbers, role-title/date rows and the header contact line should each stay on one line.
4. If you added glyphs outside basic Latin, run `pdffonts cv/Noah-Diggs-CV.pdf`. Every font
   must be Lora or SourceSans3. A `Liberation*` or `DejaVu*` entry means a character fell
   back (this happened with `→`; see Gotchas).
5. If you changed a colour, run `python3 .claude/skills/cv/scripts/contrast.py`.
6. Commit `cv/index.html` **and** `cv/Noah-Diggs-CV.pdf` together. Re-rendering always rewrites
   the PDF's timestamp, so `git checkout cv/Noah-Diggs-CV.pdf` if the HTML didn't change.

Playwright and Chromium are preinstalled in cloud sessions (`/opt/pw-browsers`). Don't run
`playwright install`. Locally, `npx playwright` or Chrome's Print → Save as PDF (margins: None,
background graphics: on) gives the same result, because `@page { size: A4; margin: 0 }` controls the layout.

## Page structure

Each page is a `div.page`: a CSS grid 210 × 297 mm, two columns (`1fr` main + `58mm` side
panel), three rows (header / body / footer).

| Page | Top row | `main` (left, white) | `aside` (right, cream panel) |
|---|---|---|---|
| 1 | `header`: eyebrow, name (`h1`), contact rows, facts line, **QR code** at right; 1.2 mm orange rule beneath | Professional Summary · Teaching Philosophy (quote + paragraph) · Teaching Experience: Stamford Elementary Music Teacher | Certification & Qualifications · At a Glance (stats) |
| 2 | `.runhead`: name + email/phone/site on one line | Teaching Experience (cont.): Stamford MUN roles · Kids' Philharmonic · Performance, Composition & Production | Recent Professional Development · Skills |

Both pages end with a `footer` ("NOAH DIGGS — CURRICULUM VITAE" · page number).

Content is distributed **by hand**. There is no automatic flow between pages. Keep a whole
role (title, dates and all its bullets) on one page; the MUN roles moved to page 2 for that
reason. When something no longer fits, move a whole block rather than shrinking type below
the minimums below.

### Building blocks (copy an existing one)

- **Section**: `<section><h2>Title</h2>…</section>`. In `main`, h2 gets a hairline extending to the right.
- **Employer**: `.org` > `.org-name` (serif) + optional `.org-desc` (one muted line).
- **Role row**: `.role` > `.role-title` + `.dates`. Flex, with dates right-aligned. Stack two `.role` rows for concurrent titles.
- **Bullets**: `ul > li`, starting with `<b>Label:</b>`. Bullets are 1.2 mm orange dots drawn in CSS.
- **Side-panel entry**: `.item` > `.item-title` + `.item-meta` (use `<br>` for institution / dates / hours).
- **Skill**: `.skill` > `dt` (small caps label) + `dd`, inside a `dl`.
- **Stat**: `.stat` > `b` (number, serif) + `span` (caption). Use the inline SVG `.to` arrow for ranges, never `→`.
- **Project** (performance credits): `.project` > `.role` + `ul`.

## Design system

The CV takes its palette and serif from the website (`ds/tokens/colors.css`, `typography.css`).
The sans and the text colours were changed for print.

### Fonts

| Role | Font | Why |
|---|---|---|
| Name, org names, quote, stat numbers | **Lora** 600–700 (italic for the quote) | Matches the site; a sturdy serif that prints well at 10 pt+ |
| Everything else: body, labels, dates, headings | **Source Sans 3** 400–700 | Adobe face built for small sizes; narrower than Work Sans, so text can be larger |

The website's **Work Sans** (thin, wide, made for screens) and **Space Mono** (tiny tracked
monospace capitals are the least legible thing on paper) were deliberately dropped. Don't
bring them back. Fonts are self-hosted woff2 files (Google Fonts "latin" subset) so the PDF
renders the same offline. To add a weight or style, fetch the CSS from Google Fonts with a desktop
browser User-Agent and download the `U+0000-00FF` file.

### Type scale (minimums matter more than exact values)

| Element | Size |
|---|---|
| Name `h1` | 25 pt Lora 600 |
| Org name | 11 pt Lora 600 · Quote 10.4 pt Lora italic · Stat number 13 pt Lora 700 |
| Body, summary | 9.6 pt / 1.4 |
| Role title | 9.8 pt 700 · Side-panel item title 9.2 pt 700 |
| Section `h2` | 9 pt 700, uppercase, +0.12em tracking |
| Meta, dates, captions, skills | 8.4–8.8 pt |
| Small caps labels, QR caption, footer | 7.8–8 pt 700 |

**Floor: nothing below ~7.8 pt, and nothing below 8.4 pt unless it's bold uppercase.**

### Colour (`:root` tokens)

| Token | Hex | Use | Contrast on cream panel |
|---|---|---|---|
| `--ink` | #241C15 | body text | 15.6:1 |
| `--ink-2` | #362B21 | contact line, stat captions | 12.8:1 |
| `--muted` | #4B3E31 | secondary text: org desc, item meta, cite, footer | 9.6:1 |
| `--teal` | #12454A | section headings, QR caption | 9.9:1 |
| `--orange-text` | #9A3800 | **orange text**: dates, eyebrow, skill labels, stat numbers | 6.6:1 |
| `--orange` | #E85C00 | **decoration only**: header rule, bullets, quote bar, contact separators | 3.3:1 ✗ |
| `--side` | #FBF6EF | side-panel background | — |
| `--rule` | #C7BBA9 | hairlines and borders | — |

Rules:
- **Never set text in `--orange`.** At 3.3:1 it fails even screen guidelines and turns to pale grey in print. Use `--orange-text`.
- Hold every text colour to **≥ 6:1 on the cream panel** (`contrast.py` flags anything lower). That leaves headroom for cheap lasers, toner dithering and black-and-white copies; the burnt orange and dark teal both become dark grey in B&W.
- Don't use light greys for "muted" text; small grey type speckles on laser printers. `--muted` is a dark brown on purpose.
- `print-color-adjust: exact` is set so the panel tint and orange rule print.

### QR code

- `cv/qr-code.png` encodes **`https://noahdiggs.com/qr`** (Noah's branded code with the NGJD
  fox logo in the centre). That route isn't defined anywhere in this repo. Make sure it
  resolves before printing a batch.
- Printed at **46 mm** square, top right of page 1, with the teal caption "Scan for portfolio,
  videos & references". Don't go below ~35 mm: it's scanned from arm's length at a fair, and the
  logo already uses part of the error-correction budget.
- Keep the white quiet zone in the PNG and nothing coloured behind it.
- After any change near it, verify it still decodes from the exported page:
  ```bash
  pip install -q opencv-python-headless
  pdftoppm -r 300 -f 1 -l 1 -png cv/Noah-Diggs-CV.pdf /tmp/qr
  python3 -c "import cv2;print(cv2.QRCodeDetector().detectAndDecode(cv2.imread('/tmp/qr-1.png'))[0])"
  ```

## Content conventions

- Wording is Noah's. Reorganise and lay out freely, but don't rewrite claims, numbers or dates
  unless asked. Point out apparent slips instead of fixing them silently (for example,
  "fast-released scaffolding" in the philosophy paragraph).
- British/Singapore spelling (programme, licence, enrolment, organised), as in the source text.
- Dates: `Mon YYYY – Mon YYYY` with an en dash; `Present` for current roles. Hours as `· 8 hrs`.
- Use real typographic characters: ’ “ ” — –, `&amp;` in HTML.
- "At a Glance" stats must be numbers that already appear elsewhere in the CV.
- Page 1 is what a recruiter sees in five seconds: the QR code, current role and certification
  stay there.

## Gotchas

- **Missing glyphs**: the self-hosted fonts are the Latin subset only. `→` (U+2192) isn't in
  Lora's or Source Sans's, so it printed in Liberation Serif. That's why stats use the inline SVG
  arrow. Check `pdffonts` after adding symbols.
- **Clipping, not reflow**: see Workflow step 2.
- The taupe `body` background around the pages (`#8A7A67`) is for on-screen viewing only and
  disappears in print (`@media print`).
- `cv/index.html` is `noindex` and not linked from the site nav. It is a print source, not a web page.
