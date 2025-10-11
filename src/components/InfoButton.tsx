import { Instagram, Linkedin } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function InfoButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const infoButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
        infoButtonRef.current?.focus();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    infoButtonRef.current?.focus();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleModalClose();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isModalOpen &&
        infoButtonRef.current &&
        !infoButtonRef.current.contains(e.target as Node)
      ) {
        const modal = document.getElementById('info-modal');
        if (modal && !modal.contains(e.target as Node)) {
          handleModalClose();
        }
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <div className="relative">
      <button
        ref={infoButtonRef}
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="fixed right-4 md:right-12 bottom-4 md:bottom-12 z-[2] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded font-mono text-[#2A2A2A] opacity-90 hover:opacity-60 transition-opacity duration-200"
        aria-label="Open info modal"
      >
        i
      </button>

      {isModalOpen && (
        <>
          <div className="hidden md:block fixed bottom-[72px] md:bottom-[88px] right-8 md:right-12 z-50">
            <div
              id="info-modal"
              className="bg-[#232323] rounded-xl shadow-2xl p-6 w-[360px] animate-modal"
              role="dialog"
              aria-modal="true"
              style={{
                animation: 'modalFadeIn 250ms ease-out'
              }}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <p className="text-white font-mono text-sm leading-relaxed">
                  built in charleston, sc<br />
                  with &lt;3
                </p>

                <p className="text-white font-mono text-xs pt-2">
                  &copy; 2025 christian gibson. all rights reserved.
                </p>

                <p className="text-white font-mono text-sm pt-1">
                  hello@christiangibson.com
                </p>

                <div className="flex gap-6 pt-4">
                  <a
                    href="https://www.instagram.com/scg_2/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-105"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-8 h-8" strokeWidth={1.5} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/christian-gibson2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-105"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-8 h-8" strokeWidth={1.5} />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div
            className="md:hidden fixed inset-0 flex items-center justify-center z-50 px-4"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(10px)'
            }}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
          >
            <div
              id="info-modal"
              className="bg-[#232323] rounded-xl shadow-2xl p-6 w-full max-w-[420px] mx-auto"
              style={{
                animation: 'modalFadeIn 250ms ease-out'
              }}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <p className="text-white font-mono text-sm leading-relaxed">
                  built in charleston, sc<br />
                  with &lt;3
                </p>

                <p className="text-white font-mono text-xs pt-2">
                  &copy; 2025 christian gibson. all rights reserved.
                </p>

                <p className="text-white font-mono text-sm pt-1">
                  hello@christiangibson.com
                </p>

                <div className="flex gap-6 pt-4">
                  <a
                    href="https://www.instagram.com/scg_2/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-105"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-8 h-8" strokeWidth={1.5} />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/christian-gibson2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white opacity-80 hover:opacity-100 transition-all duration-300 hover:scale-105"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-8 h-8" strokeWidth={1.5} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
