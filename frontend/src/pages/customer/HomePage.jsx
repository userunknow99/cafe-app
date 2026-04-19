import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { menuAPI } from '../../services/api.js';
import MenuItemCard from '../../components/customer/MenuItemCard.jsx';
import { CATEGORIES } from '../../utils/helpers.js';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    menuAPI.getAll({ featured: 'true', available: 'true' })
      .then(({ data }) => setFeatured(data.data.slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        minHeight: '90vh',
        background: `linear-gradient(135deg, var(--coffee-500) 0%, var(--coffee-400) 50%, var(--coffee-300) 100%)`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', width: 600, height: 600,
          background: 'rgba(255,255,255,0.04)', borderRadius: '50%',
          top: -200, right: -200, pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400,
          background: 'rgba(255,255,255,0.03)', borderRadius: '50%',
          bottom: -100, left: -100, pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
          <div style={{ maxWidth: 640 }} className="animate-slideUp">
            <span style={{
              display: 'inline-block', marginBottom: 20,
              background: 'rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.9)',
              padding: '6px 18px', borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              ☕ Artisan Coffee & More
            </span>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              fontWeight: 700, lineHeight: 1.1,
              color: 'white',
              marginBottom: 24,
            }}>
              Every sip tells<br />
              <em style={{ fontStyle: 'italic', color: 'var(--coffee-100)' }}>a story.</em>
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.7, marginBottom: 40,
            }}>
              Handcrafted beverages, artisan desserts, and wholesome meals — 
              made with love and the finest ingredients. Order online and pick up in minutes.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/menu">
                <button className="btn btn-primary btn-lg" style={{
                  background: 'white', color: 'var(--coffee-400)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                }}>
                  Browse Menu →
                </button>
              </Link>
              <Link to="/menu">
                <button className="btn btn-lg" style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white', border: '1.5px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(4px)',
                }}>
                  View Specials ✨
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0 }}>
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L48 50C96 40 192 20 288 20C384 20 480 40 576 45C672 50 768 40 864 35C960 30 1056 30 1152 35C1248 40 1344 50 1392 55L1440 60V60H0V60Z" fill="var(--bg-primary)" />
          </svg>
        </div>
      </section>

      {/* Category Pills */}
      <section className="section-sm" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.8rem',
            marginBottom: 24, textAlign: 'center',
          }}>
            What are you craving?
          </h2>
          <div style={{
            display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center',
          }}>
            {CATEGORIES.filter(c => c.value !== 'all').map((cat) => (
              <Link key={cat.value} to={`/menu?category=${cat.value}`}>
                <button style={{
                  padding: '10px 20px', borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-card)',
                  border: '1.5px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: 8,
                  fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer',
                  transition: 'var(--transition)',
                  color: 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--accent)';
                  e.currentTarget.style.background = 'var(--accent-light)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'var(--bg-card)';
                }}>
                  <span>{cat.emoji}</span> {cat.label}
                </button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)' }}>
                Our Favourites
              </h2>
              <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>
                Handpicked by our baristas, loved by everyone.
              </p>
            </div>
            <Link to="/menu">
              <button className="btn btn-outline">View Full Menu →</button>
            </Link>
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : (
            <div className="stagger" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 24,
            }}>
              {featured.map((item) => (
                <MenuItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features strip */}
      <section className="section-sm" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 32, textAlign: 'center',
          }}>
            {[
              { icon: '⚡', title: 'Quick Pickup', desc: 'Ready in 10–15 minutes' },
              { icon: '🌿', title: 'Fresh Ingredients', desc: 'Locally sourced daily' },
              { icon: '❤️', title: 'Made with Love', desc: 'Crafted by our baristas' },
              { icon: '📱', title: 'Easy Ordering', desc: 'Order online anytime' },
            ].map((f) => (
              <div key={f.title} style={{ padding: 24 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 6 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
