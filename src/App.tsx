import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { InfoButton } from './components/InfoButton';
import { ThemeToggle } from './components/ThemeToggle';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Home } from './pages/Home';
import { Works } from './pages/Works';
import { About } from './pages/About';

function AppContent() {
  const { isDark } = useTheme();

  return (
    <div
      className={`min-h-screen h-screen flex flex-col overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-black' : 'bg-white'
      }`}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/works" element={<Works />} />
        <Route path="/about" element={<About />} />
      </Routes>

      <nav className="flex justify-center gap-12 pb-8 md:pb-12 z-[2] relative">
        <Navigation />
      </nav>

      <InfoButton />
      <ThemeToggle />

      <div className="fixed left-4 md:left-12 top-4 md:top-12 z-[2] flex flex-col gap-2">
        <div
          className={`px-3 py-2 text-xs font-mono rounded transition-all duration-200 ${
            isDark
              ? 'bg-[#171717] text-white border border-white/15'
              : 'bg-[#f5f5f5] text-black border border-black/15'
          }`}
        >
          ⚠️Staging Site — For testing purposes only.🧪
        </div>
        <button
          id="logout"
          onClick={() => {
            sessionStorage.removeItem("preview_authed_v1");
            window.location.reload();
          }}
          className={`focus:outline-none focus:ring-2 focus:ring-opacity-50 rounded transition-all duration-200 px-3 py-2 text-xs font-mono uppercase tracking-wider ${
            isDark
              ? 'bg-[#171717] text-white border border-white/15 hover:bg-[#1f1f1f] focus:ring-white'
              : 'bg-[#f5f5f5] text-black border border-black/15 hover:bg-[#e5e5e5] focus:ring-black'
          }`}
        >
          logout
        </button>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
