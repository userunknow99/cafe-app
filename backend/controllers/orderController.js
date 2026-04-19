/**
 * controllers/orderController.js — Order Management
 */

const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

/**
 * @desc    Place a new order
 * @route   POST /api/orders
 * @access  Public
 */
exports.createOrder = async (req, res) => {
  const { customer, items } = req.body;

  if (!customer || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid order data' });
  }

  // Validate each item and snapshot data from DB
  const orderItems = [];
  let totalAmount = 0;

  for (const item of items) {
    const menuItem = await MenuItem.findById(item.menuItemId);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: `Menu item with ID ${item.menuItemId} not found`,
      });
    }

    if (!menuItem.isAvailable) {
      return res.status(400).json({
        success: false,
        message: `"${menuItem.name}" is currently unavailable`,
      });
    }

    const quantity = parseInt(item.quantity, 10);
    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const subtotal = parseFloat((menuItem.price * quantity).toFixed(2));
    totalAmount += subtotal;

    orderItems.push({
      menuItem: menuItem._id,
      name: menuItem.name,          // Snapshot
      price: menuItem.price,        // Snapshot
      image: menuItem.image,
      quantity,
      subtotal,
    });
  }

  const order = await Order.create({
    customer: {
      name: customer.name,
      phone: customer.phone,
      notes: customer.notes || '',
    },
    items: orderItems,
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    statusHistory: [{ status: 'pending' }],
  });

  res.status(201).json({ success: true, data: order });
};

/**
 * @desc    Get all orders (admin)
 * @route   GET /api/orders
 * @access  Admin
 */
exports.getOrders = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const query = {};
  if (status && status !== 'all') {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [orders, total] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Order.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: orders,
  });
};

/**
 * @desc    Get single order
 * @route   GET /api/orders/:id
 * @access  Admin
 */
exports.getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.status(200).json({ success: true, data: order });
};

/**
 * @desc    Update order status
 * @route   PUT /api/orders/:id/status
 * @access  Admin
 */
exports.updateOrderStatus = async (req, res) => {
  const { status, note } = req.body;

  const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.status = status;
  order.statusHistory.push({ status, note: note || '', changedAt: new Date() });
  await order.save();

  res.status(200).json({ success: true, data: order });
};

/**
 * @desc    Get analytics summary for admin dashboard
 * @route   GET /api/orders/analytics/summary
 * @access  Admin
 */
exports.getAnalytics = async (req, res) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalOrders,
    todayOrders,
    monthOrders,
    statusBreakdown,
    totalRevenue,
    monthRevenue,
    recentOrders,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: startOfToday } }),
    Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Order.aggregate([
      { $match: { status: { $nin: ['cancelled'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    Order.aggregate([
      { $match: { createdAt: { $gte: startOfMonth }, status: { $nin: ['cancelled'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    Order.find().sort({ createdAt: -1 }).limit(5),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalOrders,
      todayOrders,
      monthOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      monthRevenue: monthRevenue[0]?.total || 0,
      statusBreakdown: statusBreakdown.reduce((acc, cur) => {
        acc[cur._id] = cur.count;
        return acc;
      }, {}),
      recentOrders,
    },
  });
};
