import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { WavelinesSection } from '../components/WavelinesSection';

interface Project {
  id: string;
  title: string;
  url: string;
  description: string;
  tech: string[];
  year: string;
}

const projects: Project[] = [
  {
    id: 'music-room-chs',
    title: 'music room chs',
    url: 'https://www.musicroomchs.com/',
    description: 'a vibrant online hub for the charleston music scene, featuring local venues, events, and artist spotlights.',
    tech: ['react', 'typescript', 'tailwind css', 'vite'],
    year: '2024'
  },
  {
    id: 'madilyn-gibson',
    title: 'madilyn gibson',
    url: 'https://madilyngibson.com/',
    description: 'a clean, modern portfolio showcasing photography and creative work with an elegant minimalist design.',
    tech: ['react', 'typescript', 'tailwind css'],
    year: '2024'
  }
];

function ProjectDetail({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(10px)'
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[#232323] shadow-2xl p-8 w-full max-w-[560px] mx-auto"
        style={{
          animation: 'modalFadeIn 250ms ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col space-y-4">
          <h2 className="text-white font-mono text-2xl mb-2">{project.title}</h2>

          <div className="space-y-3">
            <div>
              <p className="text-white opacity-60 font-mono text-xs uppercase tracking-wider mb-1">
                year
              </p>
              <p className="text-white font-mono text-base">
                {project.year}
              </p>
            </div>

            <div>
              <p className="text-white opacity-60 font-mono text-xs uppercase tracking-wider mb-1">
                about
              </p>
              <p className="text-white font-mono text-base leading-relaxed">
                {project.description}
              </p>
            </div>

            <div>
              <p className="text-white opacity-60 font-mono text-xs uppercase tracking-wider mb-2">
                tech stack
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="text-white font-mono text-sm px-3 py-1 bg-black bg-opacity-40"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white font-mono text-sm opacity-80 hover:opacity-100 transition-opacity"
              >
                visit site
                <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-6 text-white font-mono text-sm opacity-60 hover:opacity-100 transition-opacity"
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
}

export function Works() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <>
      <div className="flex-1 grid grid-rows-[2fr_1fr]">
        <WavelinesSection />

        <section className="flex items-center justify-center px-6 z-10" aria-label="selected works">
        <div className="w-full max-w-[720px] flex flex-col gap-4">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="relative bg-[#232323] h-[88px] md:h-[96px] px-6 flex items-center justify-between group transition-all duration-200 hover:outline hover:outline-1 hover:outline-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/50 animate-fadeIn"
              style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.6)',
                animationDelay: `${index * 50}ms`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.6)';
              }}
            >
              <button
                onClick={() => setSelectedProject(project)}
                className="absolute inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50"
                aria-label={`Open case study: ${project.title}`}
              />

              <span className="text-white font-mono text-lg md:text-xl tracking-wide relative z-10 pointer-events-none">
                {project.title}
              </span>

              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-20 text-white opacity-80 hover:opacity-100 transition-all duration-150 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-50"
                aria-label={`Open ${project.title} website in new tab`}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
              </a>
            </div>
          ))}
        </div>
        </section>
      </div>

      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}
