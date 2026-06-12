/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Admin Seed Script
 *
 * Creates an initial admin user in the database.
 * Run: npx ts-node seed.ts
 * Or:  npx tsx seed.ts
 *
 * Required environment variables (from .env.local):
 *  - MONGODB_URI
 *  - ADMIN_NAME
 *  - ADMIN_EMAIL
 *  - ADMIN_PASSWORD
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load env from .env.local
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123456';

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

async function seed() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log(`⚠️  Admin user already exists: ${ADMIN_EMAIL}`);
      console.log(`   Role: ${existingAdmin.role}`);

      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated existing user to admin role');
      }
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

      // Create admin user
      const admin = await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
      });

      console.log('✅ Admin user created successfully!');
      console.log(`   Name:  ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role:  ${admin.role}`);
    }

    // Create sample products if none exist
    const ProductSchema = new mongoose.Schema(
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        stock: { type: Number, required: true },
        imageUrl: { type: String },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
      { timestamps: true }
    );

    const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
    const productCount = await Product.countDocuments();

    if (productCount === 0) {
      const adminUser = await User.findOne({ email: ADMIN_EMAIL });

      const sampleProducts = [
        {
          title: 'Premium Wireless Headphones',
          description: 'High-fidelity Bluetooth headphones with active noise cancellation, 30-hour battery life, and premium comfort padding.',
          price: 299.99,
          category: 'electronics',
          stock: 50,
          createdBy: adminUser._id,
        },
        {
          title: 'Ergonomic Office Chair',
          description: 'Adjustable lumbar support, mesh back, armrests, and tilt mechanism. Perfect for long working hours.',
          price: 449.99,
          category: 'furniture',
          stock: 25,
          createdBy: adminUser._id,
        },
        {
          title: 'Organic Green Tea Collection',
          description: 'Premium Japanese sencha, matcha, and genmaicha in a beautiful gift box. 100% organic certified.',
          price: 34.99,
          category: 'food',
          stock: 200,
          createdBy: adminUser._id,
        },
        {
          title: 'Full-Stack Development Book',
          description: 'Comprehensive guide to modern web development with React, Node.js, and MongoDB. 500+ pages.',
          price: 49.99,
          category: 'books',
          stock: 100,
          createdBy: adminUser._id,
        },
        {
          title: 'Mechanical Gaming Keyboard',
          description: 'Cherry MX switches, RGB backlighting, programmable macros, and aircraft-grade aluminum frame.',
          price: 159.99,
          category: 'electronics',
          stock: 75,
          createdBy: adminUser._id,
        },
        {
          title: 'Yoga Mat Pro',
          description: 'Extra thick 6mm mat with alignment guides, non-slip surface, and eco-friendly TPE material.',
          price: 59.99,
          category: 'sports',
          stock: 150,
          createdBy: adminUser._id,
        },
      ];

      await Product.insertMany(sampleProducts);
      console.log(`✅ Created ${sampleProducts.length} sample products`);
    } else {
      console.log(`ℹ️  ${productCount} products already exist, skipping sample data`);
    }

    console.log('\n🎉 Seed completed successfully!');
    console.log('\nYou can now login with:');
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
