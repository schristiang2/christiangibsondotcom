import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export function Navigation() {
  const location = useLocation();
  const { isDark } = useTheme();

  const getTextColor = () => {
    return isDark ? 'text-white' : 'text-black/60';
  };

  return (
    <>
      <Link
        to="/"
        className={`${getTextColor()} font-mono text-sm md:text-base transition-all duration-200 hover:opacity-100 ${
          location.pathname === '/' ? 'opacity-100' : 'opacity-75'
        }`}
      >
        home
      </Link>
      <Link
        to="/works"
        className={`${getTextColor()} font-mono text-sm md:text-base transition-all duration-200 hover:opacity-100 ${
          location.pathname === '/works' ? 'opacity-100' : 'opacity-75'
        }`}
      >
        works
      </Link>
      <Link
        to="/about"
        className={`${getTextColor()} font-mono text-sm md:text-base transition-all duration-200 hover:opacity-100 ${
          location.pathname === '/about' ? 'opacity-100' : 'opacity-75'
        }`}
      >
        about
      </Link>
    </>
  );
}
