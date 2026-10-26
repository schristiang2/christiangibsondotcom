// Shared by middleware.ts and api/projectsmashburger-form.ts.
// The password is NEVER stored in the repo (it's public) — it comes from
// the PROJECTSMASHBURGER_PASSWORD environment variable set in Vercel.

export const PS_COOKIE = 'ps_access';

export async function psAccessToken(): Promise<string | null> {
  const password = process.env.PROJECTSMASHBURGER_PASSWORD;
  if (!password) return null;
  const data = new TextEncoder().encode(`project-smashburger:${password}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function readCookie(request: Request, name: string): string | undefined {
  const header = request.headers.get('cookie') ?? '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return undefined;
}

export async function hasPsAccess(request: Request): Promise<boolean> {
  const token = await psAccessToken();
  return !!token && readCookie(request, PS_COOKIE) === token;
}
