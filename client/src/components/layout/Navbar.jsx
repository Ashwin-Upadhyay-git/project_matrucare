import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/login', label: 'Login' },
  { to: '/signup', label: 'Signup' }
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-slate-900">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">MatruCare AI</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {user && (
            <>
              <NavLink to="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">Dashboard</NavLink>
              <button type="button" onClick={handleLogout} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white">Logout</button>
            </>
          )}
        </nav>

        <button type="button" className="rounded-lg border border-slate-200 p-2 md:hidden" onClick={() => setIsOpen((value) => !value)} aria-label="Toggle menu">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setIsOpen(false)} className="text-sm font-medium text-slate-700">
                {link.label}
              </NavLink>
            ))}
            {user && (
              <>
                <NavLink to="/dashboard" onClick={() => setIsOpen(false)} className="text-sm font-medium text-slate-700">Dashboard</NavLink>
                <button type="button" onClick={handleLogout} className="mt-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white">Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
