/**
 * models/Order.js — Customer Order Schema
 */

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  name: { type: String, required: true },       // Snapshot at order time
  price: { type: Number, required: true },       // Snapshot at order time
  image: { type: String },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  subtotal: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    customer: {
      name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
        maxlength: [80, 'Name cannot exceed 80 characters'],
      },
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[\d\s\+\-\(\)]{7,20}$/, 'Please enter a valid phone number'],
      },
      notes: {
        type: String,
        trim: true,
        maxlength: [300, 'Notes cannot exceed 300 characters'],
      },
    },
    items: [orderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'pending',
    },
    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  { timestamps: true }
);

// Auto-generate order number before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    this.orderNumber = `BH-${dateStr}-${String(count + 1).padStart(4, '0')}`;
  }

  // Track status changes
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({ status: this.status });
  }

  next();
});

// Index for queries
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);
