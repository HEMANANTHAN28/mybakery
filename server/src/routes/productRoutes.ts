import { Router, Request, Response } from 'express';
import Product from '../models/Product.js';
import { protect, admin } from '../middleware/auth.js';

const router = Router();

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const { category, search, featured } = req.query;
    const query: any = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single product by id
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, price, description, image, category, stock, ingredients, isFeatured } = req.body;

    const product = new Product({
      name,
      price,
      description,
      image,
      category,
      stock,
      ingredients: ingredients || [],
      isFeatured: isFeatured || false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, price, description, image, category, stock, ingredients, isFeatured } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.description = description || product.description;
      product.image = image || product.image;
      product.category = category || product.category;
      product.stock = stock !== undefined ? stock : product.stock;
      product.ingredients = ingredients || product.ingredients;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req: Request, res: Response): Promise<any> => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
