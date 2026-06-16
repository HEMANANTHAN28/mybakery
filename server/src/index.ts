import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import User from './models/User.js';
import Product from './models/Product.js';

// Load env variables
dotenv.config();

// Connect to database and only seed after connection


const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Bakery API Server is running...' });
});

// Seed data function
const seedData = async () => {
  try {
    // Check if products exist
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('No products found, seeding default catalog...');

      const defaultProducts = [
        {
          name: 'Artisan Sourdough Bread',
          price: 6.50,
          description: 'Traditional slow-fermented sourdough with a crispy crust and soft, airy crumb.',
          image: '/images/sourdough.png',
          category: 'Bread',
          stock: 20,
          ingredients: ['Wheat flour', 'Water', 'Sea salt', 'Wild yeast starter'],
          isFeatured: true
        },
        {
          name: 'Classic Butter Croissant',
          price: 3.75,
          description: 'Flaky, golden-brown puff pastry made with premium cultured French butter.',
          image: '/images/croissant.png',
          category: 'Pastry',
          stock: 30,
          ingredients: ['Flour', 'Butter', 'Milk', 'Sugar', 'Yeast', 'Salt'],
          isFeatured: true
        },
        {
          name: 'Strawberry Tart',
          price: 5.50,
          description: 'Sweet pastry crust filled with vanilla pastry cream and topped with fresh organic strawberries.',
          image: '/images/strawberry_tart.png',
          category: 'Specialty',
          stock: 15,
          ingredients: ['Strawberries', 'Flour', 'Butter', 'Milk', 'Eggs', 'Sugar', 'Vanilla bean'],
          isFeatured: true
        },
        {
          name: 'Chocolate Fudge Cake',
          price: 28.00,
          description: 'Decadent double-layered chocolate cake iced with rich Belgian dark chocolate ganache.',
          image: '/images/chocolate_cake.png',
          category: 'Cake',
          stock: 8,
          ingredients: ['Dark chocolate', 'Cocoa powder', 'Flour', 'Sugar', 'Butter', 'Eggs', 'Buttermilk'],
          isFeatured: true
        },
        {
          name: 'Chocolate Chip Cookie',
          price: 2.50,
          description: 'Chewy, soft-baked cookies loaded with semi-sweet chocolate chunks and topped with sea salt.',
          image: '/images/cookie.png',
          category: 'Cookie',
          stock: 50,
          ingredients: ['Flour', 'Chocolate chips', 'Brown sugar', 'Butter', 'Eggs', 'Vanilla extract', 'Sea salt'],
          isFeatured: false
        },
        {
          name: 'Almond Croissant',
          price: 4.50,
          description: 'Twice-baked butter croissant filled with sweet almond frangipane cream and topped with sliced almonds.',
          image: '/images/almond_croissant.png',
          category: 'Pastry',
          stock: 12,
          ingredients: ['Flour', 'Butter', 'Almond flour', 'Sugar', 'Eggs', 'Sliced almonds'],
          isFeatured: false
        }
      ];

      await Product.insertMany(defaultProducts);
      console.log('Seeded products successfully!');
    }

    // Check if users exist
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('No users found, seeding default users...');

      // Admin user
      await User.create({
        name: 'Bakery Admin',
        email: 'admin@bakery.com',
        password: 'admin123',
        isAdmin: true,
        phone: '123-456-7890',
        address: '123 Baker St, Flour City'
      });

      // Regular user
      await User.create({
        name: 'John Doe',
        email: 'user@bakery.com',
        password: 'user123',
        isAdmin: false,
        phone: '987-654-3210',
        address: '456 Wheat Ave, Pastry Town'
      });

      console.log('Seeded users successfully!');
      console.log('Default Admin Account: admin@bakery.com / admin123');
      console.log('Default User Account: user@bakery.com / user123');
    }
  }  catch (error) {
  console.error("MongoDB Connection Error:", error);
  throw error;
}
};
(async () => {
  await connectDB();
  await seedData();
})();

// Start seeding
// Wait 3 seconds for DB to connect before seeding

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
