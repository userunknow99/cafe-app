import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { orderAPI } from '../../services/api.js';
import { formatPrice, getErrorMessage } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', notes: '' });
  const [errors, setErrors] = useState({});

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 16 }}>Cart is empty</h2>
        <Link to="/menu"><button className="btn btn-primary">Browse Menu</button></Link>
      </div>
    );
  }

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^[\d\s+\-()]{7,20}$/.test(form.phone)) e.phone = 'Enter a valid phone number';
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: '' }));
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const payload = {
        customer: { name: form.name.trim(), phone: form.phone.trim(), notes: form.notes.trim() },
        items: cart.map((i) => ({ menuItemId: i._id, quantity: i.quantity })),
      };
      const { data } = await orderAPI.create(payload);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-confirmed/${data.data._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '80vh', padding: '48px 0' }}>
      <div className="container" style={{ maxWidth: 960 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: 32 }}>
          Checkout
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
          {/* Customer form */}
          <div className="card animate-slideUp" style={{ padding: 28 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 24 }}>
              Your Details
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="input-group">
                <label className="input-label">Full Name *</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Sarah Johnson"
                  value={form.name}
                  onChange={handleChange('name')}
                  style={{ borderColor: errors.name ? '#dc2626' : undefined }}
                />
                {errors.name && <span style={{ fontSize: '0.8rem', color: '#dc2626' }}>{errors.name}</span>}
              </div>

              <div className="input-group">
                <label className="input-label">Phone Number *</label>
                <input
                  type="tel"
                  className="input"
                  placeholder="e.g. +1 555 0123"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  style={{ borderColor: errors.phone ? '#dc2626' : undefined }}
                />
                {errors.phone && <span style={{ fontSize: '0.8rem', color: '#dc2626' }}>{errors.phone}</span>}
              </div>

              <div className="input-group">
                <label className="input-label">Special Notes (optional)</label>
                <textarea
                  className="input"
                  placeholder="Any special requests, allergies, or instructions..."
                  value={form.notes}
                  onChange={handleChange('notes')}
                  rows={3}
                  style={{ resize: 'vertical', minHeight: 80 }}
                />
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="card animate-slideUp" style={{ padding: 28 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 20 }}>
                Order Review
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                {cart.map((item) => (
                  <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={item.image} alt={item.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>× {item.quantity}</div>
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--accent)' }}>{formatPrice(total)}</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 6 }}>
                  💳 Payment at counter upon pickup
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn btn-primary"
                style={{ width: '100%', padding: 14, fontSize: '1rem' }}
              >
                {submitting ? (
                  <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Placing Order...</>
                ) : '✓ Place Order'}
              </button>

              <Link to="/cart" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
