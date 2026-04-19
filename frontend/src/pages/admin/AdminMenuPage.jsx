import { useEffect, useState, useRef } from 'react';
import { menuAPI } from '../../services/api.js';
import { CATEGORIES, formatPrice, getErrorMessage } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

// ── Menu Item Form Modal ───────────────────────────────────────────────────
function MenuItemModal({ item, onClose, onSaved }) {
  const isEdit = !!item;
  const fileRef = useRef();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(item?.image || '');
  const [form, setForm] = useState({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || '',
    category: item?.category || 'coffee',
    isAvailable: item?.isAvailable ?? true,
    isFeatured: item?.isFeatured ?? false,
    preparationTime: item?.preparationTime || 10,
    tags: item?.tags?.join(', ') || '',
    imageUrl: item?.image || '',
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Enter a valid price';
    if (!form.category) e.category = 'Category is required';
    return e;
  };

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((er) => ({ ...er, [field]: '' }));
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k !== 'imageUrl') fd.append(k, v);
      });
      if (file) {
        fd.append('image', file);
      } else if (form.imageUrl) {
        fd.append('image', form.imageUrl);
      }

      if (isEdit) {
        await menuAPI.update(item._id, fd);
        toast.success('Menu item updated ✓');
      } else {
        await menuAPI.create(fd);
        toast.success('Menu item added ✓');
      }
      onSaved();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="card animate-scaleIn" style={{
        width: '100%', maxWidth: 600, maxHeight: '90vh',
        overflow: 'auto', padding: 32,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>
            {isEdit ? '✏️ Edit Item' : '➕ New Menu Item'}
          </h2>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-accent)',
            border: '1px solid var(--border)', cursor: 'pointer', fontSize: '1rem',
          }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Name */}
          <div className="input-group" style={{ gridColumn: '1/-1' }}>
            <label className="input-label">Item Name *</label>
            <input className="input" value={form.name} onChange={handleChange('name')}
              placeholder="e.g. Vanilla Latte"
              style={{ borderColor: errors.name ? '#dc2626' : undefined }} />
            {errors.name && <span style={{ fontSize: '0.78rem', color: '#dc2626' }}>{errors.name}</span>}
          </div>

          {/* Description */}
          <div className="input-group" style={{ gridColumn: '1/-1' }}>
            <label className="input-label">Description *</label>
            <textarea className="input" value={form.description} onChange={handleChange('description')}
              placeholder="Describe the item..."
              rows={3} style={{ resize: 'vertical', borderColor: errors.description ? '#dc2626' : undefined }} />
            {errors.description && <span style={{ fontSize: '0.78rem', color: '#dc2626' }}>{errors.description}</span>}
          </div>

          {/* Price */}
          <div className="input-group">
            <label className="input-label">Price (USD) *</label>
            <input className="input" type="number" step="0.01" min="0"
              value={form.price} onChange={handleChange('price')}
              placeholder="0.00"
              style={{ borderColor: errors.price ? '#dc2626' : undefined }} />
            {errors.price && <span style={{ fontSize: '0.78rem', color: '#dc2626' }}>{errors.price}</span>}
          </div>

          {/* Category */}
          <div className="input-group">
            <label className="input-label">Category *</label>
            <select className="input" value={form.category} onChange={handleChange('category')}>
              {CATEGORIES.filter(c => c.value !== 'all').map(c => (
                <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
              ))}
            </select>
          </div>

          {/* Prep time */}
          <div className="input-group">
            <label className="input-label">Prep Time (mins)</label>
            <input className="input" type="number" min="1" max="120"
              value={form.preparationTime} onChange={handleChange('preparationTime')} />
          </div>

          {/* Tags */}
          <div className="input-group">
            <label className="input-label">Tags (comma-separated)</label>
            <input className="input" value={form.tags} onChange={handleChange('tags')}
              placeholder="vegan, popular, spicy" />
          </div>

          {/* Toggles */}
          <div style={{ gridColumn: '1/-1', display: 'flex', gap: 24 }}>
            {[['isAvailable', '✅ Available'], ['isFeatured', '⭐ Featured']].map(([field, label]) => (
              <label key={field} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" checked={form[field]} onChange={handleChange(field)}
                  style={{ width: 16, height: 16, accentColor: 'var(--accent)', cursor: 'pointer' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{label}</span>
              </label>
            ))}
          </div>

          {/* Image */}
          <div className="input-group" style={{ gridColumn: '1/-1' }}>
            <label className="input-label">Image</label>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Preview */}
              {preview && (
                <img src={preview} alt="preview"
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                  onError={() => setPreview('')}
                />
              )}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input className="input" value={form.imageUrl} onChange={(e) => {
                  handleChange('imageUrl')(e);
                  setPreview(e.target.value);
                }} placeholder="Paste image URL (or upload below)" />
                <button type="button" onClick={() => fileRef.current.click()}
                  className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
                  📁 Upload File
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                {file && <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📎 {file.name}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 28 }}>
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="btn btn-primary">
            {loading
              ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</>
              : isEdit ? '✓ Save Changes' : '✓ Add Item'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Confirm Delete Dialog ──────────────────────────────────────────────────
function DeleteConfirm({ item, onConfirm, onCancel, loading }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div className="card animate-scaleIn" style={{ maxWidth: 400, width: '100%', padding: 28, textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🗑️</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 8 }}>Delete Item?</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>
          Are you sure you want to delete <strong>"{item.name}"</strong>? This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button onClick={onCancel} className="btn btn-outline">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="btn btn-danger">
            {loading ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> Deleting...</> : '🗑️ Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AdminMenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (search) params.search = search;
      const { data } = await menuAPI.getAll(params);
      setItems(data.data);
    } catch { setItems([]); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const t = setTimeout(fetchItems, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [search, categoryFilter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await menuAPI.delete(deleteTarget._id);
      toast.success(`"${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
      fetchItems();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 4 }}>Menu Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="btn btn-primary">
          + Add New Item
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
          <input className="input" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..." style={{ paddingLeft: 36 }} />
        </div>
        <select className="input" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          style={{ flex: '0 1 180px' }}>
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🍽️</div>
          <p>No items found. <button className="btn btn-outline btn-sm" onClick={() => { setShowModal(true); setEditItem(null); }} style={{ marginLeft: 8 }}>Add one?</button></p>
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--bg-accent)', borderBottom: '1px solid var(--border)' }}>
                  {['Item', 'Category', 'Price', 'Status', 'Actions'].map((h) => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left',
                      fontSize: '0.75rem', fontWeight: 600,
                      color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em',
                      whiteSpace: 'nowrap',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item._id} style={{
                    borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-accent)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Item */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={item.image} alt={item.name}
                          style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100'; }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--accent-light)', color: 'var(--accent)',
                        fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize',
                      }}>
                        {CATEGORIES.find(c => c.value === item.category)?.emoji} {item.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--accent)' }}>
                      {formatPrice(item.price)}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          fontSize: '0.78rem', fontWeight: 500,
                          color: item.isAvailable ? '#065f46' : '#991b1b',
                        }}>
                          {item.isAvailable ? '🟢 Available' : '🔴 Unavailable'}
                        </span>
                        {item.isFeatured && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--accent)' }}>⭐ Featured</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => { setEditItem(item); setShowModal(true); }}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="btn btn-sm"
                          style={{ padding: '6px 12px', fontSize: '0.78rem', background: '#fee2e2', color: '#991b1b', border: 'none' }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <MenuItemModal
          item={editItem}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSaved={() => { setShowModal(false); setEditItem(null); fetchItems(); }}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <DeleteConfirm
          item={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
