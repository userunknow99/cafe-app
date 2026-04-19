import { useEffect, useState, useCallback } from 'react';
import { orderAPI } from '../../services/api.js';
import { formatPrice, formatDate, ORDER_STATUSES, getErrorMessage } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

// ── Order Detail Modal ─────────────────────────────────────────────────────
function OrderDetailModal({ order, onClose, onStatusUpdated }) {
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async () => {
    if (status === order.status) { onClose(); return; }
    setLoading(true);
    try {
      await orderAPI.updateStatus(order._id, status, note);
      toast.success(`Order status updated to "${status}"`);
      onStatusUpdated();
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const STATUS_COLORS = {
    pending: '#f59e0b', preparing: '#3b82f6',
    ready: '#10b981', completed: '#22c55e', cancelled: '#ef4444',
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="card animate-scaleIn" style={{
        width: '100%', maxWidth: 540, maxHeight: '90vh',
        overflow: 'auto', padding: 32,
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem' }}>Order Details</h2>
            <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1rem', marginTop: 2 }}>{order.orderNumber}</p>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-accent)',
            border: '1px solid var(--border)', cursor: 'pointer',
          }}>✕</button>
        </div>

        {/* Customer info */}
        <div style={{ background: 'var(--bg-accent)', borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 20 }}>
          <h4 style={{ fontWeight: 600, marginBottom: 8, fontSize: '0.9rem' }}>👤 Customer</h4>
          <p style={{ fontSize: '0.88rem', marginBottom: 4 }}><strong>Name:</strong> {order.customer.name}</p>
          <p style={{ fontSize: '0.88rem', marginBottom: 4 }}><strong>Phone:</strong> {order.customer.phone}</p>
          {order.customer.notes && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 6, fontStyle: 'italic' }}>
              📝 {order.customer.notes}
            </p>
          )}
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8 }}>
            🕐 {formatDate(order.createdAt)}
          </p>
        </div>

        {/* Items */}
        <h4 style={{ fontWeight: 600, marginBottom: 12, fontSize: '0.9rem' }}>🍽️ Items Ordered</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {order.items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', background: 'var(--bg-accent)',
              borderRadius: 'var(--radius-md)',
            }}>
              {item.image && (
                <img src={item.image} alt={item.name}
                  style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{item.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {formatPrice(item.price)} × {item.quantity}
                </div>
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{formatPrice(item.subtotal)}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '12px 0', borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)', marginBottom: 24,
          fontWeight: 700, fontSize: '1rem',
        }}>
          <span>Total</span>
          <span style={{ color: 'var(--accent)' }}>{formatPrice(order.totalAmount)}</span>
        </div>

        {/* Status update */}
        <h4 style={{ fontWeight: 600, marginBottom: 12, fontSize: '0.9rem' }}>🔄 Update Status</h4>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {ORDER_STATUSES.map(({ value, label }) => (
            <button key={value} onClick={() => setStatus(value)} style={{
              padding: '7px 14px', borderRadius: 'var(--radius-full)',
              border: `2px solid ${status === value ? STATUS_COLORS[value] : 'var(--border)'}`,
              background: status === value ? `${STATUS_COLORS[value]}18` : 'transparent',
              color: status === value ? STATUS_COLORS[value] : 'var(--text-muted)',
              fontWeight: status === value ? 700 : 400,
              fontSize: '0.82rem', cursor: 'pointer', transition: 'var(--transition)',
            }}>
              {label}
            </button>
          ))}
        </div>

        <div className="input-group" style={{ marginBottom: 20 }}>
          <label className="input-label">Note (optional)</label>
          <input className="input" value={note} onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Customer notified, item ready at counter" />
        </div>

        {/* Status history */}
        {order.statusHistory?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h4 style={{ fontWeight: 600, marginBottom: 10, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              History
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[...order.statusHistory].reverse().map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span className={`badge badge-${h.status}`} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>{h.status}</span>
                  <span>{formatDate(h.changedAt)}</span>
                  {h.note && <span style={{ fontStyle: 'italic' }}>— {h.note}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-ghost">Close</button>
          <button onClick={handleStatusUpdate} disabled={loading} className="btn btn-primary">
            {loading ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</> : '✓ Update Status'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const STATUS_COLORS = {
    pending: '#f59e0b', preparing: '#3b82f6',
    ready: '#10b981', completed: '#22c55e', cancelled: '#ef4444',
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const { data } = await orderAPI.getAll(params);
      setOrders(data.data);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch { setOrders([]); }
    finally { setLoading(false); }
  }, [statusFilter, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Reset to page 1 on filter change
  useEffect(() => { setPage(1); }, [statusFilter]);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 4 }}>
          Orders
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{total} total orders</p>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {[{ value: 'all', label: 'All' }, ...ORDER_STATUSES].map(({ value, label }) => (
          <button key={value} onClick={() => setStatusFilter(value)} style={{
            padding: '8px 16px', borderRadius: 'var(--radius-full)',
            background: statusFilter === value ? 'var(--accent)' : 'var(--bg-card)',
            color: statusFilter === value ? 'white' : 'var(--text-secondary)',
            border: statusFilter === value ? 'none' : '1.5px solid var(--border)',
            fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer',
            transition: 'var(--transition)',
          }}>
            {label}
          </button>
        ))}
        <button onClick={fetchOrders} style={{
          marginLeft: 'auto', padding: '8px 14px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--bg-card)', border: '1.5px solid var(--border)',
          cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-muted)',
        }}>
          🔄 Refresh
        </button>
      </div>

      {/* Orders table */}
      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📦</div>
          <p>No orders found for this filter.</p>
        </div>
      ) : (
        <>
          <div className="card" style={{ overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-accent)', borderBottom: '1px solid var(--border)' }}>
                    {['Order #', 'Customer', 'Items', 'Total', 'Status', 'Time', 'Action'].map((h) => (
                      <th key={h} style={{
                        padding: '12px 14px', textAlign: 'left',
                        fontSize: '0.72rem', fontWeight: 600,
                        color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em',
                        whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, i) => (
                    <tr key={order._id} style={{
                      borderBottom: i < orders.length - 1 ? '1px solid var(--border)' : 'none',
                      cursor: 'pointer', transition: 'background 0.15s',
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent)', fontFamily: 'monospace' }}>
                          {order.orderNumber}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{order.customer.name}</div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{order.customer.phone}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--accent)' }}>
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span className={`badge badge-${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {formatDate(order.createdAt)}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.78rem', padding: '5px 12px' }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center' }}>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn btn-outline btn-sm"
                style={{ opacity: page === 1 ? 0.4 : 1 }}
              >
                ← Prev
              </button>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', padding: '0 8px' }}>
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="btn btn-outline btn-sm"
                style={{ opacity: page === totalPages ? 0.4 : 1 }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Order detail modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdated={() => {
            fetchOrders();
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}
