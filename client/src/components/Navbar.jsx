import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import Logo from './Logo';

const LINKS = [
  { to: '/', label: 'Destinations' },
  { to: '/ai-search', label: 'AI Planner' },
];

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { pathname } = useLocation();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const navBase =
    'fixed top-0 inset-x-0 z-50 transition-all duration-300 h-[72px] flex items-center';
  const navScrolled = 'bg-white/80 backdrop-blur-md shadow-sm';
  const navTransparent = 'bg-transparent';

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-indigo-600' : 'text-[#0F172A] hover:text-indigo-600'
    }`;

  return (
    <nav className={`no-print ${navBase} ${scrolled ? navScrolled : navTransparent}`}>
      <div className="max-w-[1200px] mx-auto px-6 w-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <Logo className="w-8 h-8" />
          TravelAI
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} className={linkClass}>
              {label}
            </NavLink>
          ))}
          {user && (
            <NavLink to="/wishlist" className={linkClass}>
              Wishlist
            </NavLink>
          )}
        </div>

        {/* Desktop auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  {user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <span className="text-sm text-[#0F172A] font-medium">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium px-4 py-2 rounded-lg border border-gray-200 text-[#0F172A] hover:bg-gray-50 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : !isAuthPage ? (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Sign up
              </Link>
            </>
          ) : null}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-[#0F172A]"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-[72px] inset-x-0 bg-white border-t border-gray-100 shadow-lg px-6 py-4 flex flex-col gap-4">
          {LINKS.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} className={linkClass} onClick={() => setMenuOpen(false)}>
              {label}
            </NavLink>
          ))}
          {user && (
            <NavLink to="/wishlist" className={linkClass} onClick={() => setMenuOpen(false)}>
              Wishlist
            </NavLink>
          )}
          <hr className="border-gray-100" />
          {user ? (
            <>
              <Link to="/profile" className="text-sm font-medium text-[#0F172A]" onClick={() => setMenuOpen(false)}>
                Profile ({user.name})
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-left text-red-500">
                Sign out
              </button>
            </>

          ) : !isAuthPage ? (
            <div className="flex gap-3">
              <Link to="/login" className="text-sm font-semibold px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold px-4 py-2 rounded-lg bg-indigo-600 text-white"
                onClick={() => setMenuOpen(false)}
              >
                Sign up
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </nav>
  );
}
