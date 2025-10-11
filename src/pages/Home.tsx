import { useEffect } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../contexts/ThemeContext';

const SOURCES = [
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/22d2b1c9-068a-4e43-3172-4982a258f400/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/3f4ea8c1-2be1-44c5-1414-60b870bf6600/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/b57a6b9b-10d5-4bae-5628-ee321832e700/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/5df2e6ae-6bb7-4567-8502-9eab3f12fa00/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/d8fee195-c77e-4d15-84e4-a83c48f79b00/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/dde97dbc-f4b9-4239-80e4-f618a9b21a00/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/4362a508-10be-495d-45c0-53cfd7782800/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/1b6d1758-c4a7-4dee-6cf5-ec3332ad5c00/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/ea2c2b56-6419-4192-81ae-c15826599c00/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/81b1a127-1f88-4380-28c4-5b83eb842900/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/ea2c2b56-6419-4192-81ae-c15826599c00/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/81b1a127-1f88-4380-28c4-5b83eb842900/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/b02394eb-67b0-4e3a-c2d3-b26c68c6f600/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/5b09a7e0-c344-44df-e682-0dc6ee2be200/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/5b09a7e0-c344-44df-e682-0dc6ee2be200/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/5b09a7e0-c344-44df-e682-0dc6ee2be200/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/480a6c17-afbb-444e-66c0-db6062f4fe00/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/3e23a46d-e7d5-4941-38c2-2df042b4bf00/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/5598d20a-4907-4172-7814-34ab40b46800/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/6241b89a-686b-49fc-cff1-4efa36018300/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/26070d36-f84a-47ad-ed57-866c53237300/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/a64a5ff4-fe3e-4ff5-8221-525f378f1600/public", 
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/a64a5ff4-fe3e-4ff5-8221-525f378f1600/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/a64a5ff4-fe3e-4ff5-8221-525f378f1600/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/8ed74b5f-0747-4678-284c-eff90b7c1800/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/59c00fd6-7699-4ed5-26b4-40c898c55600/public",
  "https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/4af6622f-0668-4c61-d8bb-62a6e160df00/public",
];

function randomSrc() {
  return SOURCES[Math.floor(Math.random() * SOURCES.length)];
}

export function Home() {
  const { isDark } = useTheme();

  useEffect(() => {
    const layer = document.getElementById("spawn-layer");
    if (!layer) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const isTouch = matchMedia("(pointer: coarse)").matches;
    const maxNodes = isTouch ? 40 : 80;
    const spawned: HTMLImageElement[] = [];
    let lastTime = 0;
    const minInterval = isTouch ? 80 : 120;

    const spawnImage = (clientX: number, clientY: number) => {
      const now = performance.now();
      if (now - lastTime < minInterval) return;
      lastTime = now;

      const img = document.createElement("img");
      img.src = randomSrc();
      img.alt = "";
      img.decoding = "async";
      img.loading = "eager";
      const size = Math.round(120 + Math.random() * 80);
      Object.assign(img.style, {
        width: `${size}px`,
        height: "auto",
        position: "absolute",
        left: `${clientX}px`,
        top: `${clientY}px`,
        transform: "translate(-50%,-50%) scale(0.92) rotate(0deg)",
        opacity: "0",
        filter: "brightness(0.95)",
        willChange: "transform,opacity",
        userSelect: "none"
      });

      layer.appendChild(img);
      spawned.push(img);

      if (spawned.length > maxNodes) {
        const old = spawned.shift();
        old?.remove();
      }

      const driftX = (Math.random() * 2 - 1) * (20 + Math.random() * 20);
      const driftY = (Math.random() * 2 - 1) * (20 + Math.random() * 20);

      gsap.to(img, { duration: 0.18, opacity: 1, scale: 1, ease: "power2.out" });

      const tl = gsap.timeline();
      tl.to(img, {
        x: `+=${driftX}`,
        y: `+=${driftY}`,
        ease: "sine.out",
        duration: 0.9 + Math.random() * 0.6
      });

      gsap.to(img, {
        opacity: 0,
        scale: 0.96,
        ease: "power1.inOut",
        delay: 3,
        duration: 0.35,
        onComplete: () => img.remove()
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      spawnImage(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        spawnImage(touch.clientX, touch.clientY);
      }
    };

    if (isTouch) {
      window.addEventListener("touchmove", handleTouchMove, { passive: true });
    } else {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <>
      <section id="hero" className="flex-1 flex items-center justify-center relative z-10">
        <div className="text-center">
          <h1
            className={`font-mono tracking-[0.02em] m-0 transition-colors duration-300 ${
              isDark ? 'text-black' : 'text-white'
            }`}
            style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 700 }}
          >
            christian gibson
          </h1>
          <p
            className={`font-mono text-[0.9rem] md:text-[1rem] tracking-[0.05em] leading-[1.4] mt-2.5 font-bold transition-colors duration-300 ${
              isDark ? 'text-black/70' : 'text-white/70'
            }`}
          >
            design + development
          </p>
        </div>
      </section>

      <div id="spawn-layer" aria-hidden="true" className="fixed inset-0 z-[1] pointer-events-none" />
    </>
  );
}
