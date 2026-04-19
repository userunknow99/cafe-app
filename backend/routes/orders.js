/**
 * routes/orders.js
 */

const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getAnalytics,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// Public
router.post('/', createOrder);

// Admin-only (must be before /:id to avoid matching "analytics")
router.get('/analytics/summary', protect, adminOnly, getAnalytics);
router.get('/', protect, adminOnly, getOrders);
router.get('/:id', protect, adminOnly, getOrder);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
