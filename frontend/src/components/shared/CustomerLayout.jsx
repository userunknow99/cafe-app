import { Outlet, Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useState } from 'react';

export default function CustomerLayout() {
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/menu', label: 'Menu' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        height: 'var(--nav-height)',
        background: 'rgba(var(--cream-rgb, 250,246,240), 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--bg-secondary)',
      }}>
        <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <span style={{ fontSize: '1.6rem' }}>☕</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              BrewHaven
            </span>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="desktop-nav">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} style={{
                padding: '8px 18px', borderRadius: 'var(--radius-full)',
                fontSize: '0.9rem', fontWeight: 500,
                color: location.pathname === to ? 'var(--accent)' : 'var(--text-secondary)',
                background: location.pathname === to ? 'var(--accent-light)' : 'transparent',
                transition: 'var(--transition)',
              }}>
                {label}
              </Link>
            ))}

            {/* Theme toggle */}
            <button onClick={toggleTheme} style={{
              width: 38, height: 38, borderRadius: '50%',
              background: 'var(--bg-accent)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', cursor: 'pointer', transition: 'var(--transition)',
            }}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Cart */}
            <Link to="/cart" style={{ position: 'relative' }}>
              <button style={{
                width: 42, height: 42, borderRadius: 'var(--radius-full)',
                background: 'var(--accent)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', border: 'none', cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(184,135,62,0.35)',
                transition: 'var(--transition)',
              }}>
                🛒
              </button>
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -6,
                  background: 'var(--rust)', color: 'white',
                  width: 20, height: 20, borderRadius: '50%',
                  fontSize: '0.7rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'scaleIn 0.2s ease',
                }}>
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none', width: 38, height: 38,
              background: 'var(--bg-accent)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              fontSize: '1.1rem', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div style={{
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border)',
            padding: '12px 24px 16px',
            display: 'flex', flexDirection: 'column', gap: 8,
            animation: 'slideDown 0.2s ease',
          }}>
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setMobileOpen(false)} style={{
                padding: '10px 16px', borderRadius: 'var(--radius-sm)',
                fontWeight: 500, color: 'var(--text-secondary)',
                background: location.pathname === to ? 'var(--accent-light)' : 'transparent',
              }}>
                {label}
              </Link>
            ))}
            <Link to="/cart" onClick={() => setMobileOpen(false)} style={{
              padding: '10px 16px', borderRadius: 'var(--radius-sm)',
              fontWeight: 500, color: 'var(--text-secondary)',
            }}>
              🛒 Cart {itemCount > 0 && `(${itemCount})`}
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 16px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Theme:</span>
              <button onClick={toggleTheme} style={{
                padding: '4px 12px', borderRadius: 'var(--radius-full)',
                background: 'var(--bg-accent)', border: '1px solid var(--border)',
                cursor: 'pointer', fontSize: '0.85rem',
              }}>
                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Page content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        padding: '32px 0',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
      }}>
        <div className="container">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 8, color: 'var(--text-secondary)' }}>
            ☕ BrewHaven Café
          </p>
          <p>© {new Date().getFullYear()} BrewHaven. Made with love & great coffee.</p>
        </div>
      </footer>

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
