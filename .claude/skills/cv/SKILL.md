---
name: cv
description: How Noah Diggs' printable 2-page A4 CVs (cv/*.html → cv/*.pdf) are built, styled and checked. Use whenever editing the CV's content, layout, fonts, colours or QR code, re-exporting the PDF, or making a variant of it (a one-page version, a tailored CV for a specific school, a cover letter in the same style).
---

# Printable CV

The CV is one hand-written HTML file that prints to exactly **two A4 pages**. The PDF is the
deliverable; the HTML is its source. It is printed for in-person recruitment fairs, so every
choice favours paper: sturdy fonts, high-contrast text, and a QR code big enough to scan from
across a table.

```
cv/
  index.html                             full CV (K-12)          → Noah-Diggs-CV.pdf
  lower-school-music.html                Lower School Music CV   → Noah-Diggs-CV-Lower-School-Music.pdf
  strings-orchestra.html                 Strings & Orchestra CV  → Noah-Diggs-CV-Strings-Orchestra.pdf
  arts-coordination.html                 Arts Coordination CV    → Noah-Diggs-CV-Arts-Coordination-Leadership.pdf
                                         each source holds all its markup and CSS (no build step, no external requests);
                                         each PDF is committed: re-export after every change
  qr-code.png           QR code (900×900, cropped from Noah's branded original, quiet zone kept)
  fonts/*.woff2         self-hosted fonts (Lora, Lora italic, Source Sans 3, Source Sans 3 italic)
.claude/skills/cv/scripts/
  render.js             exports the PDF and reports spare room per column; optional PNG previews
  contrast.py           contrast ratio of every colour token on white and on the side panel
```

## Workflow for any change

1. Edit the CV's HTML (`cv/index.html` or a version; see **Versions** below).
2. Render and check fit:
   ```bash
   NODE_PATH=$(npm root -g) node .claude/skills/cv/scripts/render.js cv/<file>.html --png <scratch-dir>
   ```
   The HTML path defaults to `cv/index.html`. The PDF is written next to it, named by the page's
   `<meta name="pdf-filename">`. It prints the space left under each column in mm and exits non-zero if any column
   overflows or the page count isn't 2. Pages are fixed-height with `overflow: hidden`, so
   **overflowing text is silently clipped, not pushed to a new page**. Always read this report.
3. Look at the PNGs (or `pdftoppm -r 70 -png cv/<name>.pdf <dir>/pg`). Check line wraps
   by eye: stat numbers, role-title/date rows and the header contact line should each stay on one line.
4. If you added glyphs outside basic Latin, run `pdffonts cv/<name>.pdf`. Every font
   must be Lora or SourceSans3. A `Liberation*` or `DejaVu*` entry means a character fell
   back (this happened with `→`; see Gotchas).
5. If you changed a colour, run `python3 .claude/skills/cv/scripts/contrast.py cv/<file>.html`.
6. Commit the HTML **and** its PDF together. Re-rendering always rewrites the PDF's timestamp,
   so `git checkout` any PDF whose HTML didn't change.

Playwright and Chromium are preinstalled in cloud sessions (`/opt/pw-browsers`). Don't run
`playwright install`. Locally, `npx playwright` or Chrome's Print → Save as PDF (margins: None,
background graphics: on) gives the same result, because `@page { size: A4; margin: 0 }` controls the layout.

## Page structure

Each page is a `div.page`: a CSS grid 210 × 297 mm, two columns (`1fr` main + `58mm` side
panel), three rows (header / body / footer).

| Page | Top row | `main` (left, white) | `aside` (right, cream panel) |
|---|---|---|---|
| 1 | `header`: eyebrow, name (`h1`), contact rows, facts line, **QR code** at right; 1.2 mm accent-colour rule beneath | Professional Summary · Teaching Philosophy (quote + paragraph) · Teaching Experience: Stamford Elementary Music Teacher | Certification & Qualifications · At a Glance (stats) |
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
- **Bullets**: `ul > li`, starting with `<b>Label:</b>`. Bullets are 1.2 mm accent-colour dots drawn in CSS.
- **Side-panel entry**: `.item` > `.item-title` + `.item-meta` (use `<br>` for institution / dates / hours).
- **Skill**: `.skill` > `dt` (small caps label) + `dd`, inside a `dl`.
- **Stat**: `.stat` > `b` (number, serif) + `span` (caption). Use the inline SVG `.to` arrow for ranges, never `→`.
- **Project** (performance credits): `.project` > `.role` + `ul`.

## Versions

Each tailored CV is its own HTML file in `cv/`, sharing `fonts/` and `qr-code.png`.

| File | For | Notes |
|---|---|---|
| `index.html` | K-12 / cross-divisional roles | Full CV: summary, philosophy + quote, nationality/DOB/work-rights line, MUN in detail |
| `lower-school-music.html` | Lower School / elementary music roles | From Noah's "Lower School Music Draft 1". No facts line or philosophy. KPO's concurrent deployments are nested `.sub` blocks. Less text than the full CV, so `roomy` opens the spacing on page 1 and page 2's side panel (page 2's main column is full at standard spacing) |
| `strings-orchestra.html` | Strings, orchestra and ensemble roles | From Noah's "Strings Orchestra Draft 1". Stamford's ensemble work leads, with an italic `.intro` line; MUN is cut down to "Additional School Contributions". Page 1's main column is full, so `roomy` goes only on page 1's `aside` and on all of page 2. **Teal accent** instead of orange, with a light teal panel (`--side` #EAF6F6) and teal hairlines (`--rule` #9BD6D9) |
| `arts-coordination.html` | Performing arts, programme coordination and leadership roles | From Noah's "Arts Coordination Leadership Draft 1". **Wine accent** (#A63A5E decoration, #8E2F4F text, 7.3:1) on the cream panel. Esplanade productions sit on page 1 so the whole MUN role fits on page 2 with Kids' Philharmonic. `roomy` on page 1's `aside` and all of page 2 |

To make a new version: copy the closest file, change `<title>` and `<meta name="pdf-filename">`,
replace the body content, and keep the `<style>` block unless the change is specific to that
version. Add version-only CSS at the end of the block with a comment saying why, as
`lower-school-music.html` does for `.sub` and `.roomy`. If you change the shared design system
(fonts, colours, type scale), make the change in **every** version and re-export every PDF.

**Filling the space.** A last page that ends 3–6 cm early is normal and fine. Don't pad Noah's
text to fill it. When a version is clearly short, open up the vertical rhythm with a page-level
class (like `.roomy`: larger section, org, bullet and item gaps) rather than enlarging the type
past the scale below. When it's long, move whole blocks between pages first.

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
| `--accent-text` | #9A3800 | **accent text**: dates, eyebrow, skill labels, stat numbers | 6.6:1 |
| `--accent` | #E85C00 | **decoration only**: header rule, bullets, quote bar, contact separators | 3.3:1 ✗ |
| `--side` | #FBF6EF | side-panel background | — |
| `--rule` | #C7BBA9 | hairlines and borders | — |

Rules:
- **Never set text in `--accent`.** In orange it's 3.3:1, which fails even screen guidelines and turns to pale grey in print. Use `--accent-text`.
- **Accent colour per version.** The highlights come only from `--accent` / `--accent-text`, so recolouring a version means changing those two values. The default is orange (#E85C00 / #9A3800). `strings-orchestra.html` uses teal: #227D83 for decoration and #175A60 for text (7.3:1). `arts-coordination.html` uses wine: #A63A5E and #8E2F4F. Gold was ruled out: its decoration shade nearly disappears on white and in B&W, and its text shade is a muddy olive below 6:1. Keep `--teal` (#12454A) for section headings in every version. For any new accent, pick the text shade with `contrast.py` (≥ 6:1 on the panel).
- Hold every text colour to **≥ 6:1 on the cream panel** (`contrast.py` flags anything lower). That leaves headroom for cheap lasers, toner dithering and black-and-white copies; the burnt orange and dark teal both become dark grey in B&W.
- Don't use light greys for "muted" text; small grey type speckles on laser printers. `--muted` is a dark brown on purpose.
- `print-color-adjust: exact` is set so the panel tint and accent rule print.

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
  pdftoppm -r 300 -f 1 -l 1 -png cv/<name>.pdf /tmp/qr
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
- The CV HTML files are `noindex` and not linked from the site nav. It is a print source, not a web page.
