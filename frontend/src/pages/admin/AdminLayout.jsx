import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useState } from 'react';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/menu', label: 'Menu', icon: '🍽️' },
  { to: '/admin/orders', label: 'Orders', icon: '📦' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const Sidebar = () => (
    <aside style={{
      width: 240, flexShrink: 0,
      background: 'var(--bg-card)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0,
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.5rem' }}>☕</span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem' }}>BrewHaven</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navItems.map(({ to, label, icon, end }) => (
          <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 'var(--radius-md)',
            fontWeight: 500, fontSize: '0.9rem',
            color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
            background: isActive ? 'var(--accent-light)' : 'transparent',
            transition: 'var(--transition)', textDecoration: 'none',
          })}>
            <span style={{ fontSize: '1.1rem' }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom controls */}
      <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
        <div style={{ padding: '10px 14px', marginBottom: 8, borderRadius: 'var(--radius-md)', background: 'var(--bg-accent)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Signed in as</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
        </div>
        <button onClick={toggleTheme} style={{
          width: '100%', padding: '9px 14px',
          borderRadius: 'var(--radius-md)', background: 'transparent',
          border: '1px solid var(--border)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 6,
        }}>
          {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
        <button onClick={handleLogout} style={{
          width: '100%', padding: '9px 14px',
          borderRadius: 'var(--radius-md)', background: '#fee2e2',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: '0.88rem', color: '#991b1b', fontWeight: 500,
        }}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Desktop sidebar */}
      <div className="admin-sidebar-desktop">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: 'relative', zIndex: 1, width: 240 }}>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Mobile topbar */}
        <div className="admin-mobile-topbar" style={{
          display: 'none', alignItems: 'center', gap: 12,
          padding: '12px 16px', background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border)',
        }}>
          <button onClick={() => setSidebarOpen(true)} style={{
            padding: '6px 10px', borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-accent)', border: '1px solid var(--border)',
            cursor: 'pointer', fontSize: '1rem',
          }}>
            ☰
          </button>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>☕ BrewHaven Admin</span>
        </div>

        <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-mobile-topbar { display: flex !important; }
          main { padding: 16px !important; }
        }
      `}</style>
    </div>
  );
}
