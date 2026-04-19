import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { menuAPI } from '../../services/api.js';
import MenuItemCard from '../../components/customer/MenuItemCard.jsx';
import { CATEGORIES } from '../../utils/helpers.js';

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const activeCategory = searchParams.get('category') || 'all';

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeCategory !== 'all') params.category = activeCategory;
      if (debouncedSearch) params.search = debouncedSearch;
      const { data } = await menuAPI.getAll(params);
      setItems(data.data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, debouncedSearch]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const setCategory = (cat) => {
    if (cat === 'all') searchParams.delete('category');
    else setSearchParams({ category: cat });
  };

  return (
    <div style={{ minHeight: '80vh', background: 'var(--bg-primary)' }}>
      {/* Page header */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        padding: '40px 0',
      }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 8 }}>
            Our Menu
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {items.length} item{items.length !== 1 ? 's' : ''} available
          </p>

          {/* Search */}
          <div style={{ marginTop: 20, position: 'relative', maxWidth: 400 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: '1rem', pointerEvents: 'none' }}>🔍</span>
            <input
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: 40 }}
            />
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {/* Category tabs */}
        <div style={{
          display: 'flex', gap: 8, flexWrap: 'wrap',
          marginBottom: 36, overflowX: 'auto', paddingBottom: 4,
        }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                background: activeCategory === cat.value ? 'var(--accent)' : 'var(--bg-card)',
                color: activeCategory === cat.value ? 'white' : 'var(--text-secondary)',
                border: activeCategory === cat.value ? 'none' : '1.5px solid var(--border)',
                fontWeight: 500, fontSize: '0.88rem', cursor: 'pointer',
                transition: 'var(--transition)', whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="loading-center">
            <div className="spinner" />
            <span style={{ color: 'var(--text-muted)' }}>Loading menu...</span>
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>🍽️</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 8 }}>Nothing found</h3>
            <p>Try a different category or search term.</p>
            <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={() => { setSearch(''); setCategory('all'); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div
            className="stagger"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            {items.map((item) => (
              <MenuItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
