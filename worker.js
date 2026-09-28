// Cloudflare Worker entry point. Static files are served straight from the
// assets directory; only /api/* requests reach this script (see
// run_worker_first in wrangler.toml).
//
// Testimonials API (stored in the TESTIMONIALS KV namespace):
//   POST   /api/testimonials            public: submit a testimonial (saved as "pending")
//   GET    /api/testimonials/approved   public: approved testimonials, safe to display
//   GET    /api/testimonials            admin:  every submission, including private fields
//   PATCH  /api/testimonials/:id        admin:  { status: "approved" | "rejected" | "pending" }
//   DELETE /api/testimonials/:id        admin:  remove a submission
//
// Admin requests need "Authorization: Bearer <ADMIN_TOKEN>", where ADMIN_TOKEN
// is a Worker secret set in the Cloudflare dashboard (or `wrangler secret put`).

const PREFIX = 'testimonial:';
const STATUSES = ['pending', 'approved', 'rejected'];
const ICON_TYPES = ['initials', 'emoji', 'icon'];
const ICON_COLORS = ['orange', 'teal', 'gold', 'ink', 'cream'];
const CURATED_ICONS = ['music', 'heart', 'star', 'apple', 'cap', 'school', 'book', 'sun', 'drum', 'mic'];
const LIMITS = { quote: 1200, name: 80, role: 60, organization: 100, email: 200, relationship: 200 };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/testimonials' || url.pathname.startsWith('/api/testimonials/')) {
      try {
        return await handleTestimonials(request, env, url);
      } catch (err) {
        return json({ error: 'Something went wrong. Please try again.' }, 500);
      }
    }
    if (url.pathname.startsWith('/api/')) return json({ error: 'Not found' }, 404);
    return env.ASSETS.fetch(request);
  },
};

async function handleTestimonials(request, env, url) {
  if (!env.TESTIMONIALS) return json({ error: 'Testimonial storage is not configured.' }, 503);
  const rest = url.pathname.slice('/api/testimonials'.length).replace(/^\/|\/$/g, '');
  const method = request.method;

  if (rest === '' && method === 'POST') return submit(request, env);
  if (rest === 'approved' && method === 'GET') return listApproved(env);

  const authError = checkAdmin(request, env);
  if (authError) return authError;

  if (rest === '' && method === 'GET') return json({ testimonials: await listAll(env) });
  if (rest && rest !== 'approved') {
    const key = PREFIX + rest;
    if (method === 'PATCH') return updateStatus(request, env, key);
    if (method === 'DELETE') {
      await env.TESTIMONIALS.delete(key);
      return json({ ok: true });
    }
  }
  return json({ error: 'Method not allowed' }, 405);
}

async function submit(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  // Honeypot: real visitors never see or fill this field.
  if (body.website) return json({ ok: true });

  const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const quote = clean(body.quote, LIMITS.quote);
  const anonymous = body.anonymous === true;
  const name = anonymous ? '' : clean(body.name, LIMITS.name);
  const role = clean(body.role, LIMITS.role);

  if (quote.length < 10) return json({ error: 'Please write a testimonial of at least a sentence.' }, 400);
  if (!anonymous && !name) return json({ error: 'Please add your name, or choose to stay anonymous.' }, 400);
  if (!role) return json({ error: 'Please choose your role.' }, 400);
  if (body.consent !== true) return json({ error: 'Please confirm Noah may publish your testimonial.' }, 400);

  const iconType = ICON_TYPES.includes(body.icon && body.icon.type) ? body.icon.type : 'initials';
  let iconValue = clean(body.icon && body.icon.value, 16);
  if (iconType === 'icon' && !CURATED_ICONS.includes(iconValue)) iconValue = 'music';
  if (iconType === 'initials') iconValue = anonymous ? '' : initialsOf(name);
  if (iconType === 'emoji' && !iconValue) iconValue = '🎵';

  const now = new Date();
  const id = now.toISOString().replace(/[-:.TZ]/g, '') + '-' + crypto.randomUUID().slice(0, 8);
  const record = {
    id,
    quote,
    anonymous,
    name,
    role,
    organization: clean(body.organization, LIMITS.organization),
    relationship: clean(body.relationship, LIMITS.relationship),
    email: clean(body.email, LIMITS.email),
    icon: { type: iconType, value: iconValue, color: ICON_COLORS.includes(body.icon && body.icon.color) ? body.icon.color : 'orange' },
    consent: true,
    status: 'pending',
    submittedAt: now.toISOString(),
  };

  await env.TESTIMONIALS.put(PREFIX + id, JSON.stringify(record), { metadata: { status: 'pending' } });
  return json({ ok: true, id }, 201);
}

async function updateStatus(request, env, key) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }
  if (!STATUSES.includes(body.status)) return json({ error: 'Unknown status.' }, 400);
  const record = await env.TESTIMONIALS.get(key, 'json');
  if (!record) return json({ error: 'Not found' }, 404);
  record.status = body.status;
  await env.TESTIMONIALS.put(key, JSON.stringify(record), { metadata: { status: body.status } });
  return json({ ok: true, testimonial: record });
}

async function listAll(env) {
  const keys = [];
  let cursor;
  do {
    const page = await env.TESTIMONIALS.list({ prefix: PREFIX, cursor });
    keys.push(...page.keys);
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  const records = await Promise.all(keys.map((k) => env.TESTIMONIALS.get(k.name, 'json')));
  return records.filter(Boolean).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
}

async function listApproved(env) {
  const all = await listAll(env);
  const approved = all
    .filter((t) => t.status === 'approved')
    .map((t) => ({
      id: t.id,
      quote: t.quote,
      name: t.anonymous ? 'Anonymous' : t.name,
      role: t.organization ? `${t.role}, ${t.organization}` : t.role,
      icon: t.icon,
    }));
  return json({ testimonials: approved }, 200, { 'Cache-Control': 'public, max-age=300' });
}

function checkAdmin(request, env) {
  if (!env.ADMIN_TOKEN) return json({ error: 'ADMIN_TOKEN secret is not set on the Worker.' }, 503);
  const header = request.headers.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!timingSafeEqual(token, env.ADMIN_TOKEN)) return json({ error: 'Unauthorized' }, 401);
  return null;
}

function timingSafeEqual(a, b) {
  const enc = new TextEncoder();
  const x = enc.encode(a);
  const y = enc.encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] || 0) ^ (y[i] || 0);
  return diff === 0;
}

function initialsOf(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}
