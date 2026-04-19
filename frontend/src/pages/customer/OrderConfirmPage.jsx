import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../../services/api.js';
import { formatPrice, formatDate } from '../../utils/helpers.js';

export default function OrderConfirmPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch order — public detail via ID (we use a simple fetch since admin auth isn't required here;
    // for a real app you'd return order data directly from the create endpoint)
    orderAPI.getOne(orderId)
      .then(({ data }) => setOrder(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="loading-center"><div className="spinner" /></div>;

  return (
    <div style={{ minHeight: '80vh', background: 'var(--bg-primary)', padding: '64px 0', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: 600, textAlign: 'center' }}>
        {/* Success icon */}
        <div className="animate-scaleIn" style={{
          width: 100, height: 100, borderRadius: '50%',
          background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '3rem', margin: '0 auto 24px',
          boxShadow: '0 8px 32px rgba(16,185,129,0.25)',
        }}>
          ✅
        </div>

        <h1 className="animate-slideUp" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 12 }}>
          Order Confirmed!
        </h1>
        <p className="animate-slideUp" style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: 32 }}>
          Thank you! Your order has been received and is being prepared.
        </p>

        {order && (
          <div className="card animate-slideUp" style={{ padding: 28, textAlign: 'left', marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 8 }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Order #</div>
                <div style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '1.05rem' }}>{order.orderNumber}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge badge-${order.status}`}>{order.status}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 16 }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>👤 {order.customer.name} · 📞 {order.customer.phone}</div>
              {order.customer.notes && <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>📝 {order.customer.notes}</div>}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6 }}>🕐 {formatDate(order.createdAt)}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span style={{ fontWeight: 600 }}>{formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: 'var(--accent)' }}>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/menu">
            <button className="btn btn-primary">Order More ☕</button>
          </Link>
          <Link to="/">
            <button className="btn btn-outline">Back to Home</button>
          </Link>
        </div>

        <p style={{ marginTop: 24, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          📍 Please present your order number at the counter.
        </p>
      </div>
    </div>
  );
}
