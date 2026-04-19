import { useCart } from '../../context/CartContext.jsx';
import { formatPrice } from '../../utils/helpers.js';
import { useState } from 'react';

export default function MenuItemCard({ item }) {
  const { addItem, cart } = useCart();
  const [imgError, setImgError] = useState(false);
  const inCart = cart.find((c) => c._id === item._id);

  return (
    <div className="card card-hover animate-slideUp" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Image */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <img
          src={imgError ? 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400' : item.image}
          alt={item.name}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        {item.isFeatured && (
          <span style={{
            position: 'absolute', top: 12, left: 12,
            background: 'var(--accent)', color: 'white',
            fontSize: '0.7rem', fontWeight: 700,
            padding: '3px 10px', borderRadius: 'var(--radius-full)',
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            ⭐ Featured
          </span>
        )}
        {!item.isAvailable && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.3 }}>
            {item.name}
          </h3>
          <span style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '1rem', whiteSpace: 'nowrap' }}>
            {formatPrice(item.price)}
          </span>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.55, flex: 1 }}>
          {item.description}
        </p>

        {/* Tags */}
        {item.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {item.tags.slice(0, 3).map((tag) => (
              <span key={tag} style={{
                fontSize: '0.7rem', padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--accent-light)',
                color: 'var(--accent)',
                fontWeight: 500,
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Add to cart */}
        <button
          onClick={() => item.isAvailable && addItem(item)}
          disabled={!item.isAvailable}
          style={{
            marginTop: 4,
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            background: inCart ? 'var(--accent-light)' : 'var(--accent)',
            color: inCart ? 'var(--accent)' : 'white',
            border: inCart ? '1.5px solid var(--accent)' : 'none',
            fontWeight: 600, fontSize: '0.88rem',
            cursor: item.isAvailable ? 'pointer' : 'not-allowed',
            opacity: item.isAvailable ? 1 : 0.5,
            transition: 'var(--transition)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          {inCart ? `✓ In Cart (${inCart.quantity})` : '+ Add to Cart'}
        </button>
      </div>
    </div>
  );
}
