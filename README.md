# Noah Diggs Music Portfolio

Static site for Noah Diggs' music educator portfolio. Pure HTML/CSS/JS —
no build step required.

- `index.html` — main landing page
- `about.html`, `gallery.html`, `contact.html`, `brand-sheet.html` — additional pages
- `ds/` — design system (styles, tokens, components)
- `brand/` — logo assets
- `support.js`, `image-slot.js` — page runtime (loads React/Babel from a CDN at
  runtime and renders the page's components; also restores photos from
  `.image-slots.state.json`)

## Deploying to Cloudflare Pages

No build command is needed — this is a static site.

**Option A: Direct upload (fastest, no GitHub needed)**
1. Go to the [Cloudflare dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Upload assets**.
2. Give the project a name and upload this entire folder (or a zip of it).
3. Cloudflare deploys it immediately and gives you a `*.pages.dev` URL.

**Option B: Connect to GitHub (auto-deploys on every push)**
1. In the Cloudflare dashboard: **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Select this repository and the branch to deploy from.
3. Build settings:
   - Framework preset: **None**
   - Build command: *(leave blank)*
   - Build output directory: `/`
4. Save and deploy. Every push to the connected branch redeploys automatically.

Once live, add a custom domain under the Pages project's **Custom domains** tab.
