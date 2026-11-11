import { ArrowUpRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface Work {
  id: string;
  title: string;
  role: string; // one-line: what you did
  year: string;
  description: string;
  tech: string[];
  url?: string;
  linkLabel?: string;
  links?: { label: string; url: string }[]; // extra links, e.g. streaming services
}

interface Group {
  id: string;
  label: string;
  works: Work[];
}

// TODO(christian): confirm years, tech + copy marked "confirm" before shipping.
const groups: Group[] = [
  {
    id: 'clients',
    label: 'client work',
    works: [
      {
        id: 'advanced-power-wash',
        title: 'advanced power wash',
        role: 'site, ongoing care + front-end redesign',
        year: '2026',
        description:
          'exterior cleaning company in myrtle beach. i run the site end to end and expanded it for their new holiday lighting service. now rebuilding the front end so it feels hand-made, not generated.',
        tech: ['design', 'development', 'hosting'],
        url: 'https://advancedpowerwashmb.com/',
      },
      {
        id: 'project-smashburger',
        title: 'project smashburger',
        role: 'site, online ordering + truck booking',
        year: '2026',
        description:
          'charleston smashburger food truck. built the original site with online ordering, now moving it off squarespace to a self-hosted build with a "book the truck" flow and custom form backend.',
        tech: ['design', 'html/css/js', 'vercel functions'],
        url: 'https://projectsmashburger.com/',
      },
      {
        id: 'lwtc',
        title: 'living water trading co',
        role: 'brand storefront',
        year: '2026',
        description:
          'apparel brand with a playful, y2k-leaning storefront: product drops with a shopping bag, an embedded lwtc.radio player and a photo gallery.',
        tech: ['design', 'development', 'e-commerce'],
        url: 'https://www.lwtctrading.co/',
      },
      {
        id: 'golf-monkey',
        title: 'golf monkey',
        role: 'site + redesign',
        year: '2026',
        description:
          'golf media brand: tour, podcast, shop, lessons and more. built the original site and am redesigning it so each part of the brand gets its own page.',
        tech: ['design', 'development'],
        url: 'https://golfmonkeysc.com/',
      },
      {
        id: 'music-room-chs',
        title: 'music room chs',
        role: 'site',
        year: '2024',
        description:
          'an online hub for the charleston music scene: local venues, events and artist spotlights.',
        tech: ['react', 'typescript', 'tailwind css', 'vite'],
        url: 'https://www.musicroomchs.com/',
      },
      {
        id: 'madilyn-gibson',
        title: 'madilyn gibson',
        role: 'portfolio site',
        year: '2024',
        description:
          'a clean, minimal portfolio for photography and creative work.',
        tech: ['react', 'typescript', 'tailwind css'],
        url: 'https://madilyngibson.com/',
      },
      {
        id: 'tim-gabrielson',
        title: 'tim gabrielson',
        role: 'site',
        year: '2023',
        description:
          'comedian, magician and keynote speaker.', // confirm: what you built
        tech: ['design', 'development'],
        // url: 'https://…', // confirm
      },
    ],
  },
  {
    id: 'product',
    label: 'product · ezhomesearch',
    works: [
      {
        id: 'ezhomesearch-redesign',
        title: 'ezhomesearch redesign',
        role: 'website redesign',
        year: '2026',
        description:
          'a ground-up redesign of the ezhomesearch home search experience, built on the new shared design system so web and mobile look and feel like one product.',
        tech: ['design', 'rails 7', 'react', 'design system'],
      },
      {
        id: 'ez-design-system',
        title: 'ez design system',
        role: 'shared components for web + mobile',
        year: '2026',
        description:
          'design tokens and foundational components (buttons, surfaces, forms) shared by the ezhomesearch website and app, with storybook previews and visual diffs on every pr.',
        tech: ['react', 'storybook', 'chromatic', 'design tokens'],
      },
      {
        id: 'facebook-catalog',
        title: 'meta listings catalog',
        role: 'integration',
        year: '2026',
        description:
          'pipes real estate listings into meta ad catalogs so they can run as home-listing ads.',
        tech: ['rails 7', 'postgresql', 'graph api'],
      },
    ],
  },
  {
    id: 'builds',
    label: 'personal builds',
    works: [
      {
        id: 'unslop',
        title: 'unslop',
        role: 'brand + pre-launch site',
        year: '2026',
        description:
          'my design repair shop for ai-made sites. not anti-ai: ai just needs someone with taste. pre-launch site with an opening countdown and a waitlist for free recorded roasts.',
        tech: ['brand', 'design', 'development'],
        url: 'https://unslopyour.site/',
      },
      {
        id: 'odysseus',
        title: 'odysseus',
        role: 'self-hosted ai workspace',
        year: '2026',
        description:
          'a private ai workspace running local models on my own machine. no cloud, no data leaving the desk.',
        tech: ['ollama', 'local llms'],
      },
      {
        id: 'fitness-aggregator',
        title: 'fitness aggregator',
        role: 'cli tool',
        year: '2026',
        description:
          'pulls fitbit and whoop data into one place from the terminal. built in versioned passes.',
        tech: ['python', 'typer', 'rich', 'httpx'],
      },
      {
        id: 'album-ranker',
        title: 'album ranker',
        role: 'interactive toy',
        year: '2026',
        description:
          'rank a discography head to head, keyboard-first.',
        tech: ['html', 'css', 'javascript'],
        url: 'https://christiangibson.com/albumrank',
        linkLabel: 'try it',
      },
    ],
  },
  {
    id: 'sound-image',
    label: 'audio + video',
    works: [
      {
        id: 'music',
        title: 'instrumental album',
        role: 'house / electronic',
        year: '2026',
        description:
          'a finished instrumental record produced in logic pro. looking for vocalists.',
        tech: ['logic pro'],
      },
      {
        id: 'be-honest',
        title: 'be honest',
        role: 'ep · cg. & micah jameson',
        year: '2022',
        description:
          'a collaborative ep with micah jameson. i produced the record and co-wrote the songs.',
        tech: ['production', 'songwriting', 'logic pro'],
        links: [
          { label: 'apple music', url: 'https://music.apple.com/us/album/be-honest-ep/1654811790' },
          { label: 'spotify', url: 'https://open.spotify.com/album/2IaBGeiRPSBGFGQn8I13b0' },
        ],
      },
      {
        id: 'golf-monkey-podcast',
        title: 'golf monkey podcast',
        role: 'channel + production',
        year: '2026',
        description:
          'golf podcast and shorts on the golfmonkey youtube channel, which i run with a friend. i handle production, the edit and the channel.',
        tech: ['video', 'audio', 'youtube'],
        links: [
          { label: 'watch an episode', url: 'https://youtu.be/j6v1PmJxHh4' },
          { label: 'apple podcasts', url: 'https://podcasts.apple.com/us/podcast/the-golf-monkey-podcast/id1708462299' },
          { label: 'spotify', url: 'https://open.spotify.com/show/4ltPF6KksyW03NIiXfkyC5' },
        ],
      },
      {
        id: 'balls-out',
        title: 'ballzout sports',
        role: 'production + edit',
        year: '2026',
        description:
          'sports talk podcast. i produce and edit the audio and video for the hosts.',
        tech: ['audio', 'video', 'editing'],
        links: [{ label: 'youtube', url: 'https://www.youtube.com/@ballzoutsports' }],
      },
      {
        id: 'photo-video',
        title: 'photo + video',
        role: 'ongoing',
        year: 'now',
        description: 'photography, videography and the occasional dj set.',
        tech: ['photo', 'video', 'dj'],
        url: 'https://www.instagram.com/scg_2/',
        linkLabel: 'see instagram',
      },
    ],
  },
];

const total = groups.reduce((n, g) => n + g.works.length, 0);

function WorkRow({
  work,
  index,
  open,
  onToggle,
  isDark,
}: {
  work: Work;
  index: number;
  open: boolean;
  onToggle: () => void;
  isDark: boolean;
}) {
  const fg = isDark ? 'text-white' : 'text-black';
  const line = isDark ? 'border-white/15' : 'border-black/15';
  const muted = isDark ? 'text-white/50' : 'text-black/50';
  const chip = isDark ? 'bg-white/10' : 'bg-black/5';
  const panelId = `work-${work.id}`;

  return (
    <li className={`border-t ${line}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={`group w-full grid grid-cols-[2.25rem_1fr_auto] min-[600px]:grid-cols-[3rem_1fr_1fr_4rem_1.5rem] items-baseline gap-x-3 py-4 min-[600px]:py-5 text-left font-mono ${fg} focus:outline-none focus-visible:ring-1 ${
          isDark ? 'focus-visible:ring-white/50' : 'focus-visible:ring-black/50'
        }`}
      >
        <span className={`text-xs ${muted} tabular-nums`}>
          {String(index).padStart(2, '0')}
        </span>
        <span className="text-base min-[600px]:text-xl tracking-wide transition-transform duration-200 group-hover:translate-x-1">
          {work.title}
        </span>
        <span className={`hidden min-[600px]:block text-sm ${muted}`}>{work.role}</span>
        <span className={`text-xs min-[600px]:text-sm ${muted} tabular-nums min-[600px]:text-right`}>
          {work.year}
        </span>
        <Plus
          className={`hidden min-[600px]:block w-4 h-4 justify-self-end self-center opacity-60 transition-transform duration-200 ${
            open ? 'rotate-45' : ''
          }`}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </button>

      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid min-[600px]:grid-cols-[3rem_1fr_1fr_4rem_1.5rem] gap-x-3 pb-6">
            <div className="hidden min-[600px]:block" />
            <div className="pl-[calc(2.25rem+0.75rem)] min-[600px]:pl-0 min-[600px]:col-span-2 font-mono space-y-4">
              <p className={`min-[600px]:hidden text-xs ${muted}`}>{work.role}</p>
              <p className={`text-sm leading-relaxed max-w-[52ch] ${fg} opacity-90`}>
                {work.description}
              </p>
              <ul className="flex flex-wrap gap-2" aria-label="tools">
                {work.tech.map((t) => (
                  <li key={t} className={`text-xs px-2 py-1 ${chip} ${fg} opacity-80`}>
                    {t}
                  </li>
                ))}
              </ul>
              {(work.url || work.links) && (
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {[
                    ...(work.url ? [{ label: work.linkLabel ?? 'visit site', url: work.url }] : []),
                    ...(work.links ?? []),
                  ].map((l) => (
                    <a
                      key={l.url}
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 text-sm ${fg} underline underline-offset-4 decoration-1 opacity-80 hover:opacity-100`}
                    >
                      {l.label}
                      <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export function NewWorks() {
  const { isDark } = useTheme();
  const [openId, setOpenId] = useState<string | null>(null);

  const fg = isDark ? 'text-white' : 'text-black';
  const muted = isDark ? 'text-white/50' : 'text-black/50';
  const line = isDark ? 'border-white/15' : 'border-black/15';

  let running = 0;

  return (
    <main className="flex-1 min-h-0 flex flex-col">
      {/* anchored top: page header stays put */}
      <div className="shrink-0 pt-8 md:pt-12">
        <div className="w-full max-w-[880px] mx-auto px-6 animate-fadeIn">
          <header className={`flex items-end justify-between border-b ${line} pb-4 font-mono`}>
            <div>
              <h1 className={`${fg} text-2xl md:text-4xl tracking-wide`}>works</h1>
              <p className={`${muted} text-xs md:text-sm mt-2`}>
                client sites, product work and things i build for fun.
              </p>
            </div>
            <span className={`${muted} text-xs tabular-nums whitespace-nowrap shrink-0 pl-4`}>
              {String(total).padStart(2, '0')} entries
            </span>
          </header>
        </div>
      </div>

      {/* only the list scrolls */}
      <div
        className="works-scroll flex-1 min-h-0 overflow-y-auto overscroll-contain"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0, #000 28px, #000 calc(100% - 48px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 28px, #000 calc(100% - 48px), transparent 100%)',
        }}
      >
        <div className="w-full max-w-[880px] mx-auto px-6 pt-8 pb-16 animate-fadeIn">
        <div className="space-y-12">
          {groups.map((group) => (
            <section key={group.id} aria-labelledby={`g-${group.id}`}>
              <h2
                id={`g-${group.id}`}
                className={`${muted} font-mono text-xs uppercase tracking-[0.2em] mb-3`}
              >
                {group.label}
              </h2>
              <ul className={`border-b ${line}`}>
                {group.works.map((work) => {
                  running += 1;
                  return (
                    <WorkRow
                      key={work.id}
                      work={work}
                      index={running}
                      isDark={isDark}
                      open={openId === work.id}
                      onToggle={() => setOpenId(openId === work.id ? null : work.id)}
                    />
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <footer className={`mt-16 font-mono text-sm ${muted}`}>
          got a site that looks like a robot made it?{' '}
          <Link to="/about" className={`${fg} underline underline-offset-4 decoration-1`}>
            let's talk
          </Link>
          .
        </footer>
        </div>
      </div>
    </main>
  );
}
