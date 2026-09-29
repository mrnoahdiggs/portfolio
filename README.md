# Noah Diggs Music Portfolio

Static site for Noah Diggs' music educator portfolio. Pure HTML/CSS/JS —
no build step required.

- `index.html` — main landing page
- `testimonial.html`, `testimonials-review.html`, `worker.js` — testimonial collection (see below)
- `about.html`, `gallery.html`, `contact.html`, `brand-sheet.html` — additional pages
- `ds/` — design system (styles, tokens, components)
- `brand/` — logo assets
- `support.js`, `image-slot.js` — page runtime (loads React/Babel from a CDN at
  runtime and renders the page's components; also restores photos from
  `.image-slots.state.json`)
- `cloudinary.js`, `media-upload.html` — Cloudinary integration for hosting new photos/videos

## Adding photos and videos (Cloudinary)

New media is hosted on Cloudinary (cloud name `xmobf5bj`) instead of being
embedded as base64 in the page. Uploads use an **unsigned upload preset**
(`claude`), so no API key/secret is needed anywhere in this repo.

1. Open `media-upload.html` in a browser (locally, or on the deployed site —
   it's not linked from the nav, so visitors won't find it, but it also
   isn't secured, so avoid sharing the URL publicly).
2. Click **Upload media** and pick a photo or video. It uploads directly to
   your Cloudinary account.
3. Copy the generated `<img>`/`<video>` snippet and paste it into whichever
   page you want it on (`index.html`, `about.html`, etc.), replacing an
   `<image-slot>` element or any placeholder content.

`cloudinary.js` also exposes helpers if you want to build Cloudinary URLs by
hand for an existing upload:
- `cld.imageUrl(publicId, { width })` — optimized image URL (auto format/quality)
- `cld.videoUrl(publicId, { width })` — optimized video URL
- `cld.videoPosterUrl(publicId, { width })` — a JPG poster frame for a video

## Collecting testimonials

- `testimonial.html` — the page to send people (`https://noahdiggs.com/testimonial`).
  They write a testimonial, give a name or stay anonymous, pick a role
  (parent, teacher, principal, student, …) and choose an avatar: initials,
  an emoji, or one of the curated icons. A live preview shows how it will look.
  Add `?name=Jane%20Doe&role=Parent` to the link to pre-fill it for someone.
- `testimonials-review.html` — private page for approving, rejecting, and
  deleting submissions. Not linked anywhere, and marked noindex.
- `worker.js` — the small Worker API behind both pages. Submissions are
  stored in the `portfolio-testimonials` KV namespace (bound as
  `TESTIMONIALS` in `wrangler.toml`) and start as **pending**. Approved ones
  are publicly readable at `/api/testimonials/approved`.
- The homepage's **Kind Words** section loads that list when the page
  opens. It only appears once at least one testimonial is approved, and
  picks up newly approved ones within about 5 minutes (the list is cached
  briefly).

**One-time setup:** the review page needs an admin password. In the
Cloudflare dashboard open **Workers & Pages → portfolio → Settings →
Variables and Secrets**, add a **Secret** named `ADMIN_TOKEN` with a long
random value, and use that value to sign in on the review page. (Or run
`npx wrangler secret put ADMIN_TOKEN`.) For local testing with `wrangler dev`, put
`ADMIN_TOKEN=...` in a `.dev.vars` file (gitignored).

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
