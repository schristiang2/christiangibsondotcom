import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { useTheme } from '../contexts/ThemeContext';

gsap.registerPlugin(Observer);

function makePoints({ amp = 0, drift = 0 }) {
  const width = 100;
  const freq = 20;
  const damp = 60;
  let step = 0;
  const pts: string[] = [];

  for (let x = 0; x <= width; x++) {
    step += x < width / 2 ? 1 : -1;
    const y = (step / damp) * amp * Math.sin(((x + drift) / damp) * freq);
    pts.push(`${x},${y}`);
  }
  return pts.join(' ');
}

export function WavelinesSection() {
  const { isDark } = useTheme();
  const rootRef = useRef<HTMLElement>(null);
  const linesRef = useRef<SVGPolylineElement[]>([]);
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    linesRef.current = Array.from(root.querySelectorAll('polyline'));

    if (reduced) {
      const staticPoints = makePoints({ amp: 0, drift: 0 });
      linesRef.current.forEach((l) => l.setAttribute('points', staticPoints));
      return;
    }

    let drift = 0;

    const updateAllLines = (pointsStr: string) => {
      linesRef.current.forEach((l) => l.setAttribute('points', pointsStr));
    };

    updateAllLines(makePoints({ amp: 0, drift }));

    const obs = Observer.create({
      target: window,
      type: 'wheel,touch,scroll,pointer',
      onChangeY({ velocityY }) {
        drift += velocityY * 0.0002;
        const amp = velocityY * 0.0005;
        updateAllLines(makePoints({ amp, drift }));
      },
    });

    return () => {
      obs?.kill();
    };
  }, [reduced]);

  return (
    <section
      id="wavelines-section"
      ref={rootRef}
      aria-label="scroll reactive waves"
      className="relative grid place-items-center select-none pointer-events-none"
    >
      <svg
        className={`wavelines w-full max-w-[720px] h-auto overflow-visible px-6 transition-colors duration-300 ${
          isDark ? 'text-white' : 'text-black'
        }`}
        viewBox="0 0 100 50"
        aria-hidden="true"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <polyline
            key={i}
            style={{ '--i': i + 1 } as React.CSSProperties}
            points="0,0 100,0"
          />
        ))}
      </svg>
    </section>
  );
}
