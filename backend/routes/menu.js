/**
 * routes/menu.js
 */

const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItem,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getMenuItems);
router.get('/:id', getMenuItem);

// Admin-only routes
router.post('/', protect, adminOnly, upload.single('image'), createMenuItem);
router.put('/:id', protect, adminOnly, upload.single('image'), updateMenuItem);
router.delete('/:id', protect, adminOnly, deleteMenuItem);

module.exports = router;
