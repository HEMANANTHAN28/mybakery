'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext.js';
import { Plus, Edit2, Trash2, X, ChevronLeft, ShieldCheck, Save, AlertCircle } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'Bread' | 'Pastry' | 'Cake' | 'Cookie' | 'Specialty';
  stock: number;
  ingredients: string[];
}

export default function AdminProductsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '/images/sourdough.png',
    category: 'Bread' as Product['category'],
    stock: '',
    ingredientsStr: '',
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        throw new Error('Failed to load products');
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
      // Fallback local mockup items
      setProducts([
        {
          _id: 'mock-1',
          name: 'Artisan Sourdough Bread',
          price: 6.50,
          description: 'Traditional slow-fermented sourdough with a crispy crust and soft, airy crumb.',
          image: '/images/sourdough.png',
          category: 'Bread',
          stock: 20,
          ingredients: ['Wheat flour', 'Water', 'Sea salt']
        },
        {
          _id: 'mock-2',
          name: 'Classic Butter Croissant',
          price: 3.75,
          description: 'Flaky, golden-brown puff pastry made with premium cultured French butter.',
          image: '/images/croissant.png',
          category: 'Pastry',
          stock: 30,
          ingredients: ['Flour', 'Butter', 'Milk']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!user.isAdmin) {
      router.push('/');
      return;
    }
    fetchProducts();
  }, [user, router]);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      name: '',
      price: '',
      description: '',
      image: '/images/sourdough.png',
      category: 'Bread',
      stock: '',
      ingredientsStr: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingId(p._id);
    setFormData({
      name: p.name,
      price: p.price.toString(),
      description: p.description,
      image: p.image,
      category: p.category,
      stock: p.stock.toString(),
      ingredientsStr: p.ingredients.join(', '),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this pastry from the catalog?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (err) {
      console.error(err);
      // Local filter fallback for offline testing
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setError('Could not connect to API server. Simulated delete locally.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const priceNum = parseFloat(formData.price);
    const stockNum = parseInt(formData.stock);
    const ingredientsArr = formData.ingredientsStr
      ? formData.ingredientsStr.split(',').map((i) => i.trim()).filter(Boolean)
      : [];

    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid price');
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      setError('Please enter a valid stock level');
      return;
    }

    const payload = {
      name: formData.name,
      price: priceNum,
      description: formData.description,
      image: formData.image,
      category: formData.category,
      stock: stockNum,
      ingredients: ingredientsArr,
    };

    try {
      const url = editingId
        ? `http://localhost:5000/api/products/${editingId}`
        : 'http://localhost:5000/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('API request failed');
      }

      await fetchProducts();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      // Offline fallback simulation
      if (editingId) {
        setProducts((prev) =>
          prev.map((p) => (p._id === editingId ? { ...p, ...payload, price: priceNum, stock: stockNum } : p))
        );
      } else {
        const newMock = {
          _id: `mock-${Date.now()}`,
          ...payload,
          price: priceNum,
          stock: stockNum,
        };
        setProducts((prev) => [...prev, newMock]);
      }
      setIsModalOpen(false);
      setError('Offline simulation: item saved locally.');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bakery-light">
        <div className="text-center font-serif text-lg text-bakery-chocolate animate-pulse">
          Opening baking cabinet...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header navigation */}
        <Link
          href="/admin"
          className="inline-flex items-center text-sm font-medium text-bakery-chocolate/60 hover:text-bakery-amber mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Admin Controls
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-bakery-chocolate flex items-center">
              <ShieldCheck className="w-8 h-8 text-bakery-amber mr-2" />
              Manage Pastry Catalog
            </h1>
            <p className="text-sm text-bakery-chocolate/65 mt-1">Configure fresh baked listings and stock levels</p>
          </div>
          
          <button
            onClick={handleOpenAddModal}
            className="bg-bakery-chocolate text-white px-5 py-3 rounded-full font-semibold hover:bg-bakery-amber transition-colors flex items-center shadow-sm text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Product
          </button>
        </div>

        {/* Global Errors */}
        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm mb-6 flex items-center animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white border border-bakery-sand rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bakery-light border-b border-bakery-sand text-xs uppercase font-semibold text-bakery-chocolate/75 tracking-wider">
                  <th className="p-6">Product</th>
                  <th className="p-6">Category</th>
                  <th className="p-6">Price</th>
                  <th className="p-6">Stock Level</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bakery-sand/75 text-sm text-bakery-chocolate/90">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-bakery-light/30 transition-colors">
                    {/* Info */}
                    <td className="p-6 flex items-center space-x-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-bakery-sand flex-shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div>
                        <span className="font-bold block">{product.name}</span>
                        <span className="text-xs text-bakery-chocolate/60 max-w-xs truncate block">{product.description}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-6">
                      <span className="bg-bakery-light border border-bakery-sand px-2.5 py-1 rounded-full text-xs font-medium text-bakery-chocolate/80">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="p-6 font-semibold">${product.price.toFixed(2)}</td>

                    {/* Stock */}
                    <td className="p-6">
                      {product.stock > 0 ? (
                        <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 text-xs font-semibold">
                          {product.stock} in stock
                        </span>
                      ) : (
                        <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200 text-xs font-semibold">
                          Sold Out
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="text-bakery-chocolate hover:text-bakery-amber p-2 hover:bg-bakery-light rounded-full transition-all inline-flex"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-all inline-flex"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-bakery-sand rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 text-bakery-chocolate/40 hover:text-bakery-chocolate focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-bakery-chocolate mb-6">
              {editingId ? 'Edit Product Item' : 'Add New Product Listing'}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Cinnamon Roll"
                  className="w-full px-4 py-2.5 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate placeholder-bakery-chocolate/30 focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
                />
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
                    Unit Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="3.50"
                    className="w-full px-4 py-2.5 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate placeholder-bakery-chocolate/30 focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
                    Stock Inventory
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="25"
                    className="w-full px-4 py-2.5 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate placeholder-bakery-chocolate/30 focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
                  Menu Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Product['category'] })}
                  className="w-full px-4 py-2.5 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
                >
                  <option value="Bread">Bread</option>
                  <option value="Pastry">Pastry</option>
                  <option value="Cake">Cake</option>
                  <option value="Cookie">Cookie</option>
                  <option value="Specialty">Specialty</option>
                </select>
              </div>

              {/* Image Path */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/sourdough.png"
                  className="w-full px-4 py-2.5 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe details, taste profile..."
                  className="w-full px-4 py-2.5 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate placeholder-bakery-chocolate/30 focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
                />
              </div>

              {/* Ingredients */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
                  Ingredients (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.ingredientsStr}
                  onChange={(e) => setFormData({ ...formData, ingredientsStr: e.target.value })}
                  placeholder="Flour, Yeast, Water, Sugar"
                  className="w-full px-4 py-2.5 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate placeholder-bakery-chocolate/30 focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
                />
              </div>

              {/* Action Submit */}
              <button
                type="submit"
                className="w-full bg-bakery-chocolate text-white py-3 rounded-xl font-semibold hover:bg-bakery-amber transition-colors flex items-center justify-center text-sm shadow-sm pt-2 cursor-pointer mt-4"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
