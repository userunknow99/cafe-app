// Format price to 2 decimal places
export const formatPrice = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

// Format date
export const formatDate = (dateStr) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr));

// Category labels
export const CATEGORIES = [
  { value: 'all', label: 'All Items', emoji: '✨' },
  { value: 'coffee', label: 'Coffee', emoji: '☕' },
  { value: 'tea', label: 'Tea', emoji: '🍵' },
  { value: 'cold-drinks', label: 'Cold Drinks', emoji: '🧋' },
  { value: 'desserts', label: 'Desserts', emoji: '🍰' },
  { value: 'meals', label: 'Meals', emoji: '🥗' },
  { value: 'snacks', label: 'Snacks', emoji: '🥐' },
];

// Status flow config
export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending', color: '#92400e' },
  { value: 'preparing', label: 'Preparing', color: '#1e40af' },
  { value: 'ready', label: 'Ready', color: '#065f46' },
  { value: 'completed', label: 'Completed', color: '#166534' },
  { value: 'cancelled', label: 'Cancelled', color: '#991b1b' },
];

// Extract error message from axios error
export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong';
