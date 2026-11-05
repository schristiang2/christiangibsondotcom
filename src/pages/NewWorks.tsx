import { ArrowUpRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { WavelinesSection } from '../components/WavelinesSection';
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
        id: 'golf-monkey',
        title: 'golf monkey',
        role: 'site + redesign',
        year: '—', // confirm
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
        role: 'site', // confirm scope
        year: '—', // confirm
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
      },
    ],
  },
  {
    id: 'sound-image',
    label: 'sound + image',
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
        className={`group w-full grid grid-cols-[2.25rem_1fr_auto] md:grid-cols-[3rem_1fr_1fr_4rem_1.5rem] items-baseline gap-x-3 py-4 md:py-5 text-left font-mono ${fg} focus:outline-none focus-visible:ring-1 ${
          isDark ? 'focus-visible:ring-white/50' : 'focus-visible:ring-black/50'
        }`}
      >
        <span className={`text-xs ${muted} tabular-nums`}>
          {String(index).padStart(2, '0')}
        </span>
        <span className="text-base md:text-xl tracking-wide transition-transform duration-200 group-hover:translate-x-1">
          {work.title}
        </span>
        <span className={`hidden md:block text-sm ${muted}`}>{work.role}</span>
        <span className={`text-xs md:text-sm ${muted} tabular-nums md:text-right`}>
          {work.year}
        </span>
        <Plus
          className={`hidden md:block w-4 h-4 justify-self-end self-center opacity-60 transition-transform duration-200 ${
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
          <div className="grid md:grid-cols-[3rem_1fr_1fr_4rem_1.5rem] gap-x-3 pb-6">
            <div className="hidden md:block" />
            <div className="pl-[calc(2.25rem+0.75rem)] md:pl-0 md:col-span-2 font-mono space-y-4">
              <p className={`md:hidden text-xs ${muted}`}>{work.role}</p>
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
              {work.url && (
                <a
                  href={work.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-sm ${fg} underline underline-offset-4 decoration-1 opacity-80 hover:opacity-100`}
                >
                  {work.linkLabel ?? 'visit site'}
                  <ArrowUpRight className="w-4 h-4" strokeWidth={1.5} />
                </a>
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
      {/* anchored top: wave lines + page header stay put */}
      <div className="shrink-0 pt-6 md:pt-10">
        <div className="mx-auto w-full" style={{ maxWidth: 'min(720px, 52vh)' }}>
          <WavelinesSection />
        </div>

        <div className="w-full max-w-[880px] mx-auto px-6 mt-4 md:mt-8 animate-fadeIn">
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
