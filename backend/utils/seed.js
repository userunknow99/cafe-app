/**
 * utils/seed.js — Seed admin user + sample menu items
 * Run: node utils/seed.js
 */

//require('dotenv').config({ path: '../.env' });
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');

// const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cafe-app';
const MONGO_URI = process.env.MONGO_URI;

const sampleMenuItems = [
  // Coffee
  { name: 'Signature Espresso', description: 'Rich double shot with a caramel crema, sourced from Ethiopian highlands.', price: 3.5, category: 'coffee', isFeatured: true, tags: ['popular', 'strong'], image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400' },
  { name: 'Vanilla Latte', description: 'Velvety steamed milk with espresso and house-made vanilla syrup.', price: 5.0, category: 'coffee', isFeatured: true, tags: ['popular'], image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400' },
  { name: 'Caramel Cappuccino', description: 'Classic cappuccino crowned with buttery caramel drizzle and micro-foam.', price: 5.5, category: 'coffee', tags: ['sweet'], image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400' },
  { name: 'Cold Brew', description: 'Steeped 18 hours for ultra-smooth, bold flavor. Served over ice.', price: 4.5, category: 'coffee', tags: ['cold', 'popular'], image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400' },
  { name: 'Flat White', description: 'Australian-style double ristretto with velvety microfoam poured over.', price: 4.8, category: 'coffee', tags: ['strong'], image: 'https://images.unsplash.com/photo-1529892485617-25f63cd7b1e9?w=400' },
  // Tea
  { name: 'Matcha Latte', description: 'Ceremonial-grade Japanese matcha whisked with creamy oat milk.', price: 5.5, category: 'tea', isFeatured: true, tags: ['vegan', 'popular'], image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400' },
  { name: 'Masala Chai', description: 'Aromatic black tea simmered with ginger, cardamom, and warm spices.', price: 4.0, category: 'tea', tags: ['spiced'], image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=400' },
  { name: 'Earl Grey', description: 'Classic bergamot-infused black tea, served with lemon or milk.', price: 3.5, category: 'tea', tags: ['classic'], image: 'https://images.unsplash.com/photo-1567922045116-2a00fae2ed03?w=400' },
  // Desserts
  { name: 'Tiramisu', description: 'Authentic Italian layers of espresso-soaked savoiardi with mascarpone cream.', price: 7.0, category: 'desserts', isFeatured: true, tags: ['popular', 'classic'], image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400' },
  { name: 'Chocolate Lava Cake', description: 'Warm dark chocolate cake with a molten center, served with vanilla ice cream.', price: 8.5, category: 'desserts', tags: ['chocolate', 'warm'], image: 'https://images.unsplash.com/photo-1617305855058-336d24456869?w=400' },
  { name: 'Cheesecake Slice', description: 'New York-style baked cheesecake on a buttery graham cracker crust.', price: 6.5, category: 'desserts', tags: ['classic'], image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400' },
  { name: 'Croissant', description: 'Freshly baked, butter-laminated croissant with a golden, flaky crust.', price: 4.0, category: 'desserts', tags: ['fresh', 'breakfast'], image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400' },
  // Meals
  { name: 'Avocado Toast', description: 'Sourdough topped with smashed avocado, cherry tomatoes, microgreens, and everything bagel seasoning.', price: 10.5, category: 'meals', isFeatured: true, tags: ['vegan', 'breakfast', 'popular'], image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=400' },
  { name: 'Eggs Benedict', description: 'Poached eggs on toasted English muffin with Canadian bacon and hollandaise.', price: 13.0, category: 'meals', tags: ['brunch', 'classic'], image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400' },
  { name: 'Grilled Panini', description: 'Pressed ciabatta with grilled chicken, pesto, mozzarella, and roasted peppers.', price: 11.5, category: 'meals', tags: ['lunch', 'popular'], image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400' },
  { name: 'Quinoa Bowl', description: 'Superfood bowl with quinoa, roasted veggies, chickpeas, and tahini dressing.', price: 12.5, category: 'meals', tags: ['vegan', 'healthy', 'gluten-free'], image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' },
  // Cold drinks
  { name: 'Fresh Lemonade', description: 'Hand-squeezed lemons with a touch of mint syrup and sparkling water.', price: 4.5, category: 'cold-drinks', tags: ['fresh', 'vegan'], image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400' },
  { name: 'Mango Smoothie', description: 'Tropical Alphonso mango blended with coconut milk and a hint of lime.', price: 6.0, category: 'cold-drinks', tags: ['vegan', 'tropical'], image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400' },
  // Snacks
  { name: 'Granola Bar', description: 'House-made oat, honey, and almond bar. Perfect grab-and-go snack.', price: 3.5, category: 'snacks', tags: ['healthy', 'vegan'], image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400' },
  { name: 'Mixed Nuts', description: 'Lightly salted premium mix of cashews, almonds, pistachios, and walnuts.', price: 4.0, category: 'snacks', tags: ['healthy', 'gluten-free'], image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400' },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'BrewHaven Admin',
      email: process.env.ADMIN_EMAIL || 'admin@brewhaven.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@1234',
      role: 'admin',
    });
    console.log(`👤 Admin created: ${admin.email}`);

    // Create menu items
    await MenuItem.insertMany(sampleMenuItems);
    console.log(`🍽️  Created ${sampleMenuItems.length} menu items`);

    console.log('\n✨ Seed complete!');
    console.log(`   Admin email:    ${admin.email}`);
    console.log(`   Admin password: ${process.env.ADMIN_PASSWORD || 'Admin@1234'}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
