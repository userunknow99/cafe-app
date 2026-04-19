import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { getErrorMessage } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      toast.success('Welcome back! ☕');
      navigate('/admin');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      position: 'relative',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden',
        background: `radial-gradient(ellipse at 20% 50%, rgba(184,135,62,0.08) 0%, transparent 60%),
                     radial-gradient(ellipse at 80% 20%, rgba(92,58,30,0.06) 0%, transparent 50%)`,
      }} />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed', top: 20, right: 20,
          width: 40, height: 40, borderRadius: '50%',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          cursor: 'pointer', fontSize: '1.1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <div className="card animate-scaleIn" style={{ width: '100%', maxWidth: 420, padding: 40 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>☕</div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.8rem', fontWeight: 700,
            marginBottom: 6,
          }}>
            BrewHaven
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Admin Panel — Sign in to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Email */}
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              className="input"
              placeholder="admin@brewhaven.com"
              value={form.email}
              onChange={handleChange('email')}
              autoComplete="email"
              style={{ borderColor: errors.email ? '#dc2626' : undefined }}
            />
            {errors.email && (
              <span style={{ fontSize: '0.78rem', color: '#dc2626' }}>{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="input-group">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange('password')}
                autoComplete="current-password"
                style={{ borderColor: errors.password ? '#dc2626' : undefined, paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '1rem', color: 'var(--text-muted)',
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <span style={{ fontSize: '0.78rem', color: '#dc2626' }}>{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '13px', fontSize: '0.95rem', marginTop: 6 }}
          >
            {loading
              ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in...</>
              : '🔐 Sign In'}
          </button>
        </form>

        {/* Demo hint */}
        <div style={{
          marginTop: 24, padding: '12px 16px',
          background: 'var(--accent-light)', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
        }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            <strong style={{ color: 'var(--accent)' }}>Demo credentials:</strong><br />
            admin@brewhaven.com / Admin@1234
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <a href="/" style={{ fontSize: '0.83rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
            ← Back to storefront
          </a>
        </div>
      </div>
    </div>
  );
}
