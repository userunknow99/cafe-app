/**
 * controllers/menuController.js — Menu Item CRUD
 */

const MenuItem = require('../models/MenuItem');

/**
 * @desc    Get all menu items (with optional filtering/search)
 * @route   GET /api/menu
 * @access  Public
 */
exports.getMenuItems = async (req, res) => {
  const { category, search, available, featured } = req.query;

  // Build query
  const query = {};

  if (category && category !== 'all') {
    query.category = category;
  }

  if (available === 'true') {
    query.isAvailable = true;
  }

  if (featured === 'true') {
    query.isFeatured = true;
  }

  // Text search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const items = await MenuItem.find(query).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
};

/**
 * @desc    Get single menu item
 * @route   GET /api/menu/:id
 * @access  Public
 */
exports.getMenuItem = async (req, res) => {
  const item = await MenuItem.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }

  res.status(200).json({ success: true, data: item });
};

/**
 * @desc    Create menu item
 * @route   POST /api/menu
 * @access  Admin
 */
exports.createMenuItem = async (req, res) => {
  const { name, description, price, category, isAvailable, isFeatured, preparationTime, tags } = req.body;

  // Handle image from Cloudinary upload
  let image = req.body.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400';
  let imagePublicId = null;

  if (req.file) {
    // Cloudinary gives us path and filename
    image = req.file.path || req.file.secure_url;
    imagePublicId = req.file.filename || req.file.public_id;
  }

  const item = await MenuItem.create({
    name,
    description,
    price: parseFloat(price),
    category,
    image,
    imagePublicId,
    isAvailable: isAvailable !== undefined ? isAvailable : true,
    isFeatured: isFeatured || false,
    preparationTime: preparationTime || 10,
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : [],
  });

  res.status(201).json({ success: true, data: item });
};

/**
 * @desc    Update menu item
 * @route   PUT /api/menu/:id
 * @access  Admin
 */
exports.updateMenuItem = async (req, res) => {
  let item = await MenuItem.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }

  const updates = { ...req.body };

  // Handle new image upload
  if (req.file) {
    updates.image = req.file.path || req.file.secure_url;
    updates.imagePublicId = req.file.filename || req.file.public_id;

    // Optional: delete old Cloudinary image
    if (item.imagePublicId) {
      try {
        const cloudinary = require('cloudinary').v2;
        await cloudinary.uploader.destroy(item.imagePublicId);
      } catch (e) {
        // Non-fatal: old image deletion failure
        console.warn('Could not delete old Cloudinary image:', e.message);
      }
    }
  }

  if (updates.tags && !Array.isArray(updates.tags)) {
    updates.tags = updates.tags.split(',').map((t) => t.trim());
  }

  if (updates.price) updates.price = parseFloat(updates.price);

  item = await MenuItem.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: item });
};

/**
 * @desc    Delete menu item
 * @route   DELETE /api/menu/:id
 * @access  Admin
 */
exports.deleteMenuItem = async (req, res) => {
  const item = await MenuItem.findById(req.params.id);

  if (!item) {
    return res.status(404).json({ success: false, message: 'Menu item not found' });
  }

  // Delete image from Cloudinary if exists
  if (item.imagePublicId) {
    try {
      const cloudinary = require('cloudinary').v2;
      await cloudinary.uploader.destroy(item.imagePublicId);
    } catch (e) {
      console.warn('Could not delete Cloudinary image:', e.message);
    }
  }

  await item.deleteOne();

  res.status(200).json({ success: true, message: 'Menu item deleted' });
};
