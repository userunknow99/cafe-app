import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../../services/api.js';
import { formatPrice, formatDate, ORDER_STATUSES } from '../../utils/helpers.js';

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div className="card animate-slideUp" style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            {label}
          </p>
          <p style={{ fontSize: '1.9rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: accent || 'var(--text-primary)', lineHeight: 1 }}>
            {value}
          </p>
          {sub && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>{sub}</p>}
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: 'var(--radius-md)',
          background: accent ? `${accent}18` : 'var(--accent-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ── Donut-style status chart ───────────────────────────────────────────────
function StatusBreakdown({ breakdown }) {
  const STATUS_COLORS = {
    pending: '#f59e0b',
    preparing: '#3b82f6',
    ready: '#10b981',
    completed: '#22c55e',
    cancelled: '#ef4444',
  };

  const entries = Object.entries(breakdown).filter(([, v]) => v > 0);
  const totalCount = entries.reduce((s, [, v]) => s + v, 0);

  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 20 }}>
        📊 Orders by Status
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {ORDER_STATUSES.map(({ value, label }) => {
          const count = breakdown[value] || 0;
          const pct = totalCount ? Math.round((count / totalCount) * 100) : 0;
          return (
            <div key={value}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.85rem' }}>
                <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</span>
                <span style={{ color: 'var(--text-muted)' }}>{count} ({pct}%)</span>
              </div>
              <div style={{ height: 8, background: 'var(--bg-accent)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${pct}%`,
                  background: STATUS_COLORS[value] || 'var(--accent)',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getAnalytics()
      .then(({ data }) => setAnalytics(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-center">
        <div className="spinner" />
        <span style={{ color: 'var(--text-muted)' }}>Loading dashboard...</span>
      </div>
    );
  }

  const stats = analytics || {};

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', marginBottom: 6 }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Welcome back! Here's what's happening at BrewHaven today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="stagger" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 20, marginBottom: 32,
      }}>
        <StatCard icon="📦" label="Total Orders" value={stats.totalOrders ?? '—'} sub="All time" />
        <StatCard icon="🌅" label="Today's Orders" value={stats.todayOrders ?? '—'} sub="Since midnight" accent="#f59e0b" />
        <StatCard icon="📅" label="This Month" value={stats.monthOrders ?? '—'} sub="Orders this month" accent="#3b82f6" />
        <StatCard icon="💰" label="Total Revenue" value={stats.totalRevenue != null ? formatPrice(stats.totalRevenue) : '—'} sub="Excl. cancelled" accent="#10b981" />
        <StatCard icon="📈" label="Month Revenue" value={stats.monthRevenue != null ? formatPrice(stats.monthRevenue) : '—'} sub="This month" accent="#8b5cf6" />
        <StatCard
          icon="⏳"
          label="Pending"
          value={stats.statusBreakdown?.pending ?? 0}
          sub="Needs attention"
          accent="#ef4444"
        />
      </div>

      {/* Charts + Recent Orders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        {/* Status breakdown */}
        {stats.statusBreakdown && (
          <StatusBreakdown breakdown={stats.statusBreakdown} />
        )}

        {/* Recent Orders */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>🕐 Recent Orders</h3>
            <Link to="/admin/orders">
              <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.8rem' }}>View All →</button>
            </Link>
          </div>

          {!stats.recentOrders?.length ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', padding: '20px 0' }}>
              No orders yet.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stats.recentOrders.map((order) => (
                <div key={order._id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px',
                  background: 'var(--bg-accent)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 2 }}>
                      {order.orderNumber}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {order.customer?.name} · {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent)' }}>
                      {formatPrice(order.totalAmount)}
                    </div>
                    <span className={`badge badge-${order.status}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/admin/menu">
          <button className="btn btn-primary">+ Add Menu Item</button>
        </Link>
        <Link to="/admin/orders">
          <button className="btn btn-outline">📦 Manage Orders</button>
        </Link>
        <a href="/" target="_blank" rel="noopener noreferrer">
          <button className="btn btn-ghost">🔗 View Storefront</button>
        </a>
      </div>
    </div>
  );
}
