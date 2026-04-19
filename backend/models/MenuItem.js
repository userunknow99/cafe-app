/**
 * models/MenuItem.js — Café Menu Item Schema
 */

const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['coffee', 'tea', 'desserts', 'meals', 'cold-drinks', 'snacks'],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    },
    imagePublicId: {
      type: String, // Cloudinary public ID for deletion
      default: null,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    preparationTime: {
      type: Number, // in minutes
      default: 10,
    },
    tags: [String], // e.g. ['vegan', 'gluten-free', 'popular']
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for search performance
menuItemSchema.index({ name: 'text', description: 'text' });
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
