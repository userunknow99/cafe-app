import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { formatPrice } from '../../utils/helpers.js';

export default function CartPage() {
  const { cart, removeItem, updateQty, total, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 40 }} className="animate-fadeIn">
          <div style={{ fontSize: '5rem', marginBottom: 20 }}>🛒</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 10 }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>Looks like you haven't added anything yet.</p>
          <Link to="/menu">
            <button className="btn btn-primary btn-lg">Browse Menu</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '80vh', padding: '48px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
            Your Cart
          </h1>
          <button
            onClick={clearCart}
            style={{
              padding: '8px 16px', borderRadius: 'var(--radius-md)',
              background: '#fee2e2', color: '#991b1b', border: 'none',
              fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer',
            }}
          >
            🗑️ Clear All
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cart.map((item) => (
              <div key={item._id} className="card animate-slideUp" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, flexWrap: 'wrap' }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-md)', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 4 }}>{item.name}</h3>
                  <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{formatPrice(item.price)}</span>
                </div>

                {/* Qty Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: 'var(--bg-accent)', borderRadius: 'var(--radius-full)',
                    padding: '4px 4px',
                  }}>
                    <button
                      onClick={() => updateQty(item._id, item.quantity - 1)}
                      style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: item.quantity === 1 ? '#fee2e2' : 'var(--bg-card)',
                        border: 'none', cursor: 'pointer', fontWeight: 700,
                        color: item.quantity === 1 ? '#991b1b' : 'var(--text-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1rem',
                      }}
                    >
                      {item.quantity === 1 ? '🗑' : '−'}
                    </button>
                    <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item._id, item.quantity + 1)}
                      style={{
                        width: 30, height: 30, borderRadius: '50%',
                        background: 'var(--accent)', color: 'white',
                        border: 'none', cursor: 'pointer', fontWeight: 700,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      +
                    </button>
                  </div>

                  <span style={{ fontWeight: 700, minWidth: 64, textAlign: 'right', color: 'var(--text-primary)' }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="card" style={{ padding: 28, position: 'sticky', top: 'calc(var(--nav-height) + 16px)', alignSelf: 'start' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 20 }}>Order Summary</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cart.map((item) => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', margin: '16px 0', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem' }}>
                <span>Total</span>
                <span style={{ color: 'var(--accent)' }}>{formatPrice(total)}</span>
              </div>
            </div>

            <Link to="/checkout">
              <button className="btn btn-primary" style={{ width: '100%', fontSize: '1rem', padding: '14px' }}>
                Proceed to Checkout →
              </button>
            </Link>
            <Link to="/menu" style={{ display: 'block', textAlign: 'center', marginTop: 12, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
