// Vercel Routing Middleware — password-protects everything under
// /projectsmashburger (pages, images, scripts) plus its form API.
// Runs on Vercel's edge before any static file is served.
import { next } from '@vercel/functions';

// Password helpers are inlined (no local imports) so Vercel's Node ESM
// runtime doesn't need to resolve extra modules.
const PS_COOKIE = 'ps_access';

async function psAccessToken(): Promise<string | null> {
  const password = process.env.PROJECTSMASHBURGER_PASSWORD;
  if (!password) return null;
  const data = new TextEncoder().encode(`project-smashburger:${password}`);
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

async function hasPsAccess(request: Request): Promise<boolean> {
  const token = await psAccessToken();
  return !!token && readCookie(request, PS_COOKIE) === token;
}

export const config = {
  matcher: ['/projectsmashburger', '/projectsmashburger/:path*', '/api/projectsmashburger-form'],
};

const UNLOCK_PATH = '/projectsmashburger/unlock';

export default async function middleware(request: Request) {
  const url = new URL(request.url);

  if (url.pathname === UNLOCK_PATH && request.method === 'POST') {
    return handleUnlock(request);
  }

  if (await hasPsAccess(request)) {
    if (url.pathname === UNLOCK_PATH) {
      return Response.redirect(new URL('/projectsmashburger', url), 303);
    }
    return next();
  }

  if (url.pathname.startsWith('/api/')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!(await psAccessToken())) {
    return new Response('PROJECTSMASHBURGER_PASSWORD is not set for this deployment.', { status: 500 });
  }

  const returnTo = url.pathname === UNLOCK_PATH ? '/projectsmashburger' : url.pathname + url.search;
  return unlockPage(returnTo, false);
}

async function handleUnlock(request: Request) {
  const form = await request.formData().catch(() => null);
  const password = String(form?.get('password') ?? '');
  const returnTo = safeReturnPath(String(form?.get('next') ?? ''));
  const expected = process.env.PROJECTSMASHBURGER_PASSWORD;

  if (!expected || password !== expected) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return unlockPage(returnTo, true);
  }

  const token = (await psAccessToken())!;
  const headers = new Headers({ Location: returnTo });
  headers.append(
    'Set-Cookie',
    `${PS_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`,
  );
  return new Response(null, { status: 303, headers });
}

function safeReturnPath(p: string) {
  return p.startsWith('/projectsmashburger') && !p.startsWith('//') ? p : '/projectsmashburger';
}

function unlockPage(returnTo: string, wrong: boolean) {
  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  const html = `<!doctype html>
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
<form method="post" action="${UNLOCK_PATH}">
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
  return new Response(html, {
    status: 401,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
