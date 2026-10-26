// Vercel Function: emails Project Smashburger form submissions
// (booking requests, contact messages, newsletter sign-ups) via Resend.
//
// Env vars (Vercel → Settings → Environment Variables):
//   RESEND_API_KEY      — from resend.com
//   PS_TO_EMAIL         — where submissions go (comma-separate for several)
//   PS_FROM_EMAIL       — sender on a domain verified in Resend,
//                          e.g. "Project Smashburger <forms@christiangibson.com>"

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

type Payload = Record<string, string | string[] | undefined>;

const FIELDS: Record<string, [key: string, label: string][]> = {
  booking: [
    ['firstName', 'First name'], ['lastName', 'Last name'], ['email', 'Email'], ['phone', 'Phone'],
    ['organization', 'Company / organization'], ['eventType', 'Event type'], ['guests', 'Estimated guests'],
    ['date', 'Event date'], ['backupDate', 'Backup date'], ['startTime', 'Serving starts'],
    ['endTime', 'Serving ends'], ['address', 'Event address'], ['access', 'Public or private'],
    ['payment', 'Who pays'], ['menu', 'Menu interest'], ['dietary', 'Dietary needs / allergies'],
    ['budget', 'Budget'], ['parking', 'Room to park'], ['power', 'Power on site'],
    ['notes', 'Notes'], ['heardFrom', 'Heard about us'],
  ],
  contact: [['firstName', 'First name'], ['lastName', 'Last name'], ['email', 'Email'], ['message', 'Message']],
  newsletter: [['email', 'Email']],
};

const REQUIRED: Record<string, string[]> = {
  booking: ['firstName', 'lastName', 'email', 'phone', 'eventType', 'guests', 'date', 'startTime',
    'endTime', 'address', 'access', 'payment', 'parking'],
  contact: ['firstName', 'lastName', 'email', 'message'],
  newsletter: ['email'],
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const text = (v: Payload[string]) => (Array.isArray(v) ? v.join(', ') : String(v ?? '')).trim();

export async function POST(request: Request) {
  if (!(await hasPsAccess(request))) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Payload | null;
  const kind = String(body?.formType ?? '');
  if (!body || !FIELDS[kind]) return Response.json({ error: 'Bad request' }, { status: 400 });

  const missing = REQUIRED[kind].filter((k) => !text(body[k]));
  if (missing.length) return Response.json({ error: 'Missing fields', missing }, { status: 400 });

  const { RESEND_API_KEY, PS_TO_EMAIL, PS_FROM_EMAIL } = process.env;
  if (!RESEND_API_KEY || !PS_TO_EMAIL || !PS_FROM_EMAIL) {
    return Response.json({ error: 'Email is not configured' }, { status: 500 });
  }

  const rows = FIELDS[kind]
    .map(([k, label]) => {
      const v = text(body[k]);
      return v
        ? `<tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top">${esc(label)}</td>` +
            `<td style="padding:6px 12px">${esc(v).replace(/\n/g, '<br>')}</td></tr>`
        : '';
    })
    .join('');

  const who = kind === 'newsletter' ? text(body.email) : `${text(body.firstName)} ${text(body.lastName)}`;
  const subject =
    kind === 'booking'
      ? `Truck booking request: ${text(body.eventType)} on ${text(body.date)} (${who})`
      : kind === 'contact'
        ? `Website message from ${who}`
        : `New Join the Club sign-up: ${who}`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: PS_FROM_EMAIL,
      to: PS_TO_EMAIL.split(',').map((s) => s.trim()),
      reply_to: text(body.email),
      subject,
      html: `<h2>${esc(subject)}</h2><table>${rows}</table>`,
    }),
  });

  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
    return Response.json({ error: 'Could not send' }, { status: 502 });
  }
  return Response.json({ ok: true });
}
