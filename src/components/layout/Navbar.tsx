'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTimeout(() => {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      }, 0);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        <span className="gradient-text">PrimeTradeAI</span>
      </Link>

      {/* Desktop links */}
      <div className="navbar-links" style={{ display: 'flex' }}>
        {isAuthenticated ? (
          <>
            <Link href="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
              Dashboard
            </Link>
            <Link href="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
              Products
            </Link>
            {isAdmin && (
              <Link href="/products/new" className={`nav-link ${isActive('/products/new') ? 'active' : ''}`}>
                Add Product
              </Link>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  {user?.name}
                </span>
                {isAdmin && <span className="badge badge-primary">Admin</span>}
              </div>
              <button onClick={toggleTheme} className="btn btn-ghost btn-icon" title="Toggle theme" style={{ fontSize: '1.2rem' }}>
                {isDark ? '☀️' : '🌙'}
              </button>
              <button onClick={logout} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link href="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
              Login
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm">
              Get Started
            </Link>
            <button onClick={toggleTheme} className="btn btn-ghost btn-icon" title="Toggle theme" style={{ fontSize: '1.2rem' }}>
              {isDark ? '☀️' : '🌙'}
            </button>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        className="btn btn-ghost btn-icon"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={{ display: 'none' }}
        aria-label="Toggle mobile menu"
      >
        ☰
      </button>
    </nav>
  );
}
