// Vercel Routing Middleware — password-protects private previews:
//   /projectsmashburger (pages, images, scripts) plus its form API
//   /golfmonkeyredesign (pages, scripts, styles)
//   /newworks (draft of the redesigned works page, served by the SPA)
// Runs on Vercel's edge before any static file is served.
import { next, rewrite } from '@vercel/functions';

// Helpers are inlined (no local imports) so Vercel's Node ESM
// runtime doesn't need to resolve extra modules.

type Site = {
  base: string; // URL prefix this site lives under
  envVar: string; // env var holding the password
  cookie: string;
  salt: string;
  api?: string[]; // API routes that share this site's password
  spa?: boolean; // served by the React app: rewrite to /index.html once unlocked
  unlockPage: (unlockPath: string, returnTo: string, wrong: boolean) => string;
};

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

const SITES: Site[] = [
  {
    base: '/projectsmashburger',
    envVar: 'PROJECTSMASHBURGER_PASSWORD',
    cookie: 'ps_access',
    salt: 'project-smashburger',
    api: ['/api/projectsmashburger-form'],
    unlockPage: smashburgerUnlockPage,
  },
  {
    base: '/golfmonkeyredesign',
    envVar: 'GOLFMONKEYREDESIGN_PASSWORD',
    cookie: 'gmr_access',
    salt: 'golf-monkey-redesign',
    unlockPage: golfMonkeyUnlockPage,
  },
  {
    base: '/newworks',
    envVar: 'NEWWORKS_PASSWORD',
    cookie: 'nw_access',
    salt: 'new-works',
    spa: true,
    unlockPage: newWorksUnlockPage,
  },
];

export const config = {
  matcher: [
    '/projectsmashburger',
    '/projectsmashburger/:path*',
    '/api/projectsmashburger-form',
    '/golfmonkeyredesign',
    '/golfmonkeyredesign/:path*',
    '/newworks',
    '/newworks/:path*',
  ],
};

async function accessToken(site: Site): Promise<string | null> {
  const password = process.env[site.envVar];
  if (!password) return null;
  const data = new TextEncoder().encode(`${site.salt}:${password}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get('cookie') ?? '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return undefined;
}

async function hasAccess(site: Site, request: Request): Promise<boolean> {
  const token = await accessToken(site);
  return !!token && readCookie(request, site.cookie) === token;
}

function siteFor(pathname: string): Site | undefined {
  return SITES.find(
    (s) => pathname === s.base || pathname.startsWith(s.base + '/') || (s.api ?? []).includes(pathname),
  );
}

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const site = siteFor(url.pathname);
  if (!site) return next();

  const unlockPath = `${site.base}/unlock`;

  if (url.pathname === unlockPath && request.method === 'POST') {
    return handleUnlock(site, request);
  }

  if (await hasAccess(site, request)) {
    if (url.pathname === unlockPath) {
      return Response.redirect(new URL(site.base, url), 303);
    }
    // No file exists at an SPA route, so hand the request straight to the app shell.
    if (site.spa) return rewrite(new URL('/', url));
    return next();
  }

  if (url.pathname.startsWith('/api/')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!(await accessToken(site))) {
    return new Response(`${site.envVar} is not set for this deployment.`, { status: 500 });
  }

  const returnTo = url.pathname === unlockPath ? site.base : url.pathname + url.search;
  return unlockResponse(site, returnTo, false);
}

async function handleUnlock(site: Site, request: Request) {
  const form = await request.formData().catch(() => null);
  const password = String(form?.get('password') ?? '');
  const returnTo = safeReturnPath(site, String(form?.get('next') ?? ''));
  const expected = process.env[site.envVar];

  if (!expected || password !== expected) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return unlockResponse(site, returnTo, true);
  }

  const token = (await accessToken(site))!;
  const headers = new Headers({ Location: returnTo });
  headers.append(
    'Set-Cookie',
    `${site.cookie}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`,
  );
  return new Response(null, { status: 303, headers });
}

function safeReturnPath(site: Site, p: string) {
  return p.startsWith(site.base) && !p.startsWith('//') ? p : site.base;
}

function unlockResponse(site: Site, returnTo: string, wrong: boolean) {
  return new Response(site.unlockPage(`${site.base}/unlock`, returnTo, wrong), {
    status: 401,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

function smashburgerUnlockPage(unlockPath: string, returnTo: string, wrong: boolean) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Project Smashburger — Password</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,500;125,700&display=swap" rel="stylesheet">
<style>
  body{margin:0;background:#000;color:#DCDCDC;font-family:Archivo,'Helvetica Neue',Arial,sans-serif;font-stretch:125%;font-weight:500;text-transform:uppercase;color-scheme:dark}
  main{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px 16px;box-sizing:border-box}
  .box{width:100%;max-width:440px}
  h1{margin:0;font-weight:700;font-size:clamp(32px,6vw,48px);line-height:1.1;letter-spacing:.01em}
  p{margin:14px 0 0;font-size:14.68px;line-height:1.6}
  form{margin-top:32px;display:flex;flex-direction:column;gap:14px}
  label{font-size:14.68px}
  input{height:46px;padding:0 16px;box-sizing:border-box;border:1px solid #6B6B6B;border-radius:12px;background:#000;color:#DCDCDC;font:inherit;font-size:15px;text-transform:none}
  input:focus-visible{outline:2px solid #23D822;outline-offset:1px}
  button{align-self:flex-start;height:50px;padding:0 28px;border:0;border-radius:0;background:#23D822;color:#000;font-family:'Helvetica Neue',Arial,sans-serif;font-weight:700;font-size:17.2px;cursor:pointer}
  .err{color:#ff8a80;text-transform:none}
</style>
</head>
<body>
<main>
<div class="box">
<h1>Project Smashburger</h1>
<p>This preview is password protected.</p>
<form method="post" action="${unlockPath}">
<input type="hidden" name="next" value="${esc(returnTo)}">
<label for="pw">Password</label>
<input id="pw" name="password" type="password" autocomplete="current-password" required autofocus>
${wrong ? '<p class="err" role="alert">Incorrect password. Try again.</p>' : ''}
<button type="submit">Enter</button>
</form>
</div>
</main>
</body>
</html>`;
}

function golfMonkeyUnlockPage(unlockPath: string, returnTo: string, wrong: boolean) {
  // The OG tags live here too: link previews (iMessage, Slack) only ever see this page.
  const og = 'https://christiangibson.com/og/golfmonkeyredesign.jpg';
  const desc = 'A preview of the Golf Monkey website redesign. Prepared by Christian Gibson.';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Golf Monkey Redesign — Password</title>
<meta name="description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:title" content="Golf Monkey — Redesign Preview">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="https://christiangibson.com/golfmonkeyredesign">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="619">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Golf Monkey — Redesign Preview">
<meta name="twitter:image" content="${og}">
<meta name="theme-color" content="#0B1F33">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@900&family=Lato:wght@400;900&family=Libre+Caslon+Text:ital@1&display=swap" rel="stylesheet">
<style>
  body{margin:0;background:#0B1F33;color:#FDFCF8;font-family:Lato,'Helvetica Neue',Arial,sans-serif;color-scheme:dark}
  main{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px 16px;box-sizing:border-box}
  .box{width:100%;max-width:440px}
  .eyebrow{margin:0;font-weight:900;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:#F0A9CF}
  h1{margin:12px 0 0;font-family:'Big Shoulders Display',Impact,sans-serif;font-weight:900;font-size:clamp(64px,14vw,96px);line-height:.86;text-transform:uppercase}
  .tag{margin:16px 0 0;font-family:'Libre Caslon Text',Georgia,serif;font-style:italic;font-size:19px;line-height:1.4;color:#D5E2EC}
  form{margin-top:32px;display:flex;flex-direction:column;gap:12px}
  label{font-weight:900;font-size:13px;letter-spacing:.1em;text-transform:uppercase}
  input{height:52px;padding:0 16px;box-sizing:border-box;border:2px solid #FDFCF8;border-radius:3px;background:transparent;color:#FDFCF8;font:inherit;font-size:16px}
  input:focus-visible{outline:3px solid #F0A9CF;outline-offset:2px}
  button{height:52px;padding:0 28px;border:0;border-radius:3px;background:#C52E83;color:#fff;font:inherit;font-weight:900;font-size:15px;letter-spacing:.06em;text-transform:uppercase;cursor:pointer}
  button:hover{background:#AE246D}
  .err{margin:0;color:#F0A9CF}
</style>
</head>
<body>
<main>
<div class="box">
<p class="eyebrow">Redesign preview</p>
<h1>Golf<br>Monkey</h1>
<p class="tag">This preview is password protected.</p>
<form method="post" action="${unlockPath}">
<input type="hidden" name="next" value="${esc(returnTo)}">
<label for="pw">Password</label>
<input id="pw" name="password" type="password" autocomplete="current-password" required autofocus>
${wrong ? '<p class="err" role="alert">Incorrect password. Try again.</p>' : ''}
<button type="submit">Tee off</button>
</form>
</div>
</main>
</body>
</html>`;
}

function newWorksUnlockPage(unlockPath: string, returnTo: string, wrong: boolean) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>christian gibson — works preview</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  body{margin:0;background:#000;color:#fff;font-family:'Space Mono',monospace;color-scheme:dark}
  main{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px 16px;box-sizing:border-box}
  .box{width:100%;max-width:400px}
  h1{margin:0;font-weight:400;font-size:clamp(28px,6vw,40px);letter-spacing:.02em}
  p{margin:10px 0 0;font-size:13px;color:rgba(255,255,255,.55)}
  form{margin-top:32px;display:flex;flex-direction:column;gap:12px}
  label{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:rgba(255,255,255,.55)}
  input{height:46px;padding:0 14px;box-sizing:border-box;border:1px solid rgba(255,255,255,.25);border-radius:0;background:transparent;color:#fff;font:inherit;font-size:15px}
  input:focus-visible{outline:1px solid #fff;outline-offset:2px}
  button{align-self:flex-start;height:44px;padding:0 24px;border:0;border-radius:0;background:#fff;color:#000;font:inherit;font-size:14px;cursor:pointer}
  button:hover{opacity:.85}
  .err{color:#ff8a80}
</style>
</head>
<body>
<main>
<div class="box">
<h1>works</h1>
<p>this preview is password protected.</p>
<form method="post" action="${unlockPath}">
<input type="hidden" name="next" value="${esc(returnTo)}">
<label for="pw">password</label>
<input id="pw" name="password" type="password" autocomplete="current-password" required autofocus>
${wrong ? '<p class="err" role="alert">wrong password. try again.</p>' : ''}
<button type="submit">enter</button>
</form>
</div>
</main>
</body>
</html>`;
}
