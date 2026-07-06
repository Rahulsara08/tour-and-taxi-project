import React, { useState } from 'react';
import { Menu, X, Phone, LogOut, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { auth } from '../lib/firebase';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { userData } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await auth.signOut();
  };

  const isDark = theme === 'dark';

  return (
    <header
      className="fixed w-full top-0 z-50 backdrop-blur-md shadow-sm border-b"
      style={{
        backgroundColor: 'var(--header-bg)',
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl md:text-2xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Shri Gurukripa
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {[
              { label: 'Home', href: '/', isLink: true },
              { label: 'Services', href: '#services' },
              { label: 'Destinations', href: '#destinations' },
              { label: 'Fleet', href: '#fleet' },
            ].map(item => (
              item.isLink ? (
                <Link
                  key={item.label}
                  to={item.href!}
                  className="font-semibold transition-colors hover:text-orange-500"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="font-semibold transition-colors hover:text-orange-500"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {item.label}
                </a>
              )
            ))}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            <a href="tel:9950072777" className="flex items-center gap-1.5 text-orange-600 font-bold text-sm">
              <Phone size={16} />
              9950072777
            </a>

            {/* ─── Dark / Light Toggle Button ─── */}
            <ThemeToggleButton id="theme-toggle-desktop" isDark={isDark} onClick={toggleTheme} />

            {/* Auth */}
            {userData ? (
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-semibold capitalize px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                >
                  {userData.name || localStorage.getItem(`sg_profile_name_${auth.currentUser?.uid}`) || userData.role}
                </span>
                {userData.role === 'admin' && (
                  <Link to="/admin" className="text-xs font-semibold text-red-500 hover:text-red-400">Admin</Link>
                )}
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 p-1.5 transition-colors cursor-pointer">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <Link
                to="/login/customer"
                className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggleButton id="theme-toggle-mobile" isDark={isDark} onClick={toggleTheme} />

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 transition-colors cursor-pointer"
              style={{ color: 'var(--text-primary)' }}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X size={26} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu size={26} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-primary)' }}
          >
            <div className="px-4 py-4 space-y-1">
              {[
                { label: 'Home', href: '/', isLink: true },
                { label: 'Services', href: '#services' },
                { label: 'Destinations', href: '#destinations' },
                { label: 'Fleet', href: '#fleet' },
              ].map(item =>
                item.isLink ? (
                  <Link
                    key={item.label}
                    to={item.href!}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2.5 rounded-lg font-semibold text-sm transition-colors hover:bg-orange-50 hover:text-orange-600"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2.5 rounded-lg font-semibold text-sm transition-colors hover:bg-orange-50 hover:text-orange-600"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.label}
                  </a>
                )
              )}
              <a href="tel:9950072777" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-orange-600 font-bold text-sm">
                <Phone size={16} /> 9950072777
              </a>
              {!userData && (
                <Link
                  to="/login/customer"
                  onClick={() => setIsOpen(false)}
                  className="block mx-3 mt-2 bg-orange-600 hover:bg-orange-700 text-white text-center px-4 py-2.5 rounded-full font-bold text-sm transition-colors"
                >
                  Login
                </Link>
              )}
              {userData && (
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2.5 text-red-400 font-semibold text-sm cursor-pointer w-full"
                >
                  <LogOut size={16} /> Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

  );
}

const ThemeToggleButton = ({
  isDark,
  onClick,
  id,
}: {
  isDark: boolean;
  onClick: () => void;
  id: string;
}) => {
  return (
    <button
      type="button"
      id={id}
      className="rounded-full transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center p-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/20 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
      onClick={onClick}
      aria-label="Toggle theme"
    >
      <svg
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        fill="currentColor"
        strokeLinecap="round"
        viewBox="0 0 32 32"
      >
        <clipPath id={`skiper-btn-${id}`}>
          <motion.path
            animate={{ y: isDark ? 10 : 0, x: isDark ? -12 : 0 }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            d="M0-5h30a1 1 0 0 0 9 13v24H0Z"
          />
        </clipPath>
        <g clipPath={`url(#skiper-btn-${id})`}>
          <motion.circle
            animate={{ r: isDark ? 10 : 8 }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            cx="16"
            cy="16"
          />
          <motion.g
            animate={{
              rotate: isDark ? -100 : 0,
              scale: isDark ? 0.5 : 1,
              opacity: isDark ? 0 : 1,
            }}
            transition={{ ease: "easeInOut", duration: 0.35 }}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M16 5.5v-4" />
            <path d="M16 30.5v-4" />
            <path d="M1.5 16h4" />
            <path d="M26.5 16h4" />
            <path d="m23.4 8.6 2.8-2.8" />
            <path d="m5.7 26.3 2.9-2.9" />
            <path d="m5.8 5.8 2.8 2.8" />
            <path d="m23.4 23.4 2.9 2.9" />
          </motion.g>
        </g>
      </svg>
    </button>
  );
};

