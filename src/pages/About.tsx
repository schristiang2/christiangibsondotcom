import { Instagram, Linkedin, Download } from 'lucide-react';

export function About() {
  return (
    <main className="flex-1 flex items-center justify-center px-3 md:px-8">
      <div className="w-full max-w-4xl bg-[#2A2A2A] py-12 px-4 md:p-12 animate-fadeIn">
        <section className="grid grid-cols-1 md:grid-cols-[256px_1fr] gap-3 md:gap-10 items-start mb-3 md:mb-8">
          <div className="flex justify-center md:justify-start">
            <img
              src="https://imagedelivery.net/eVY4ern2bRf7fhcrsxmD0w/0263a07e-5cad-4cbf-1902-d7453777be00/public"
              alt="christian gibson"
              className="w-full max-w-[180px] md:max-w-[256px] h-[180px] md:h-[256px] object-cover"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-white font-mono font-medium lowercase tracking-wide text-center md:text-left mb-3 md:mb-8" style={{ fontSize: 'clamp(22px, 4vw, 44px)' }}>
              christian gibson
            </h1>

            <nav className="flex justify-center md:justify-start gap-6 md:gap-8 mb-3 md:mb-8" aria-label="Social links">
              <a
                href="https://www.instagram.com/scg_2/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white transition-all duration-150 hover:opacity-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/35 p-1 opacity-80"
              >
                <Instagram size={26} className="md:w-8 md:h-8" strokeWidth={1.5} />
              </a>

              <a
                href="https://www.linkedin.com/in/christian-gibson2"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-white transition-all duration-150 hover:opacity-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/35 p-1 opacity-80"
              >
                <Linkedin size={26} className="md:w-8 md:h-8" strokeWidth={1.5} />
              </a>

              <a
                href="/christian-gibson-resume.pdf"
                download
                aria-label="Download resume"
                className="text-white transition-all duration-150 hover:opacity-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/35 p-1 opacity-80"
              >
                <Download size={26} className="md:w-8 md:h-8" strokeWidth={1.5} />
              </a>
            </nav>
          </div>
        </section>

        <section className="md:pl-0">
          <p className="text-white font-mono leading-relaxed mb-3 md:mb-5 text-xs md:text-base" style={{ lineHeight: '1.5' }}>
            built with intention. a mix of design, code, and curiosity.<br />
            i make things that feel alive on the web: small details, thoughtful motion, clean structure.
          </p>

          <p className="text-white font-mono leading-relaxed text-xs md:text-base" style={{ lineHeight: '1.5' }}>
            if it looks simple, it's because it was designed that way.<br />
            if it feels smooth, it's because it was built with care.
          </p>
        </section>
      </div>
    </main>
  );
}
