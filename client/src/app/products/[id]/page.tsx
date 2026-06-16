'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ChevronLeft, Heart, CheckCircle2, ShieldCheck, Leaf } from 'lucide-react';
import { useCart } from '../../../context/CartContext';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
  ingredients: string[];
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [addedNotify, setAddedNotify] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          throw new Error('Not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        // Fallback mock items
        const mockDatabase: Record<string, Product> = {
          'mock-1': {
            _id: 'mock-1',
            name: 'Artisan Sourdough Bread',
            price: 6.50,
            description: 'Our signature loaf. Naturally leavened sourdough, slow-fermented for over 24 hours to develop a crisp, mahogany crust and a light, airy crumb with a mild tang.',
            image: '/images/sourdough.png',
            category: 'Bread',
            stock: 20,
            ingredients: ['Stone-ground unbleached wheat flour', 'Purified water', 'Sea salt', 'Wild yeast starter culture']
          },
          'mock-2': {
            _id: 'mock-2',
            name: 'Classic Butter Croissant',
            price: 3.75,
            description: 'An authentic French classic. Our bakers roll thin, crisp layers of laminated yeast dough with premium high-fat cultured butter for a light, flaky pastry with a honeycombed crumb.',
            image: '/images/croissant.png',
            category: 'Pastry',
            stock: 30,
            ingredients: ['Unbleached pastry flour', 'Cultured French butter', 'Fresh organic whole milk', 'Cane sugar', 'Yeast', 'Sea salt']
          },
          'mock-3': {
            _id: 'mock-3',
            name: 'Strawberry Tart',
            price: 5.50,
            description: 'A delicate dessert masterpiece. Sweet, buttery shortbread crust (pâte sablée) filled with rich Madagascar vanilla pastry cream, finished with fresh sliced organic strawberries and glaze.',
            image: '/images/strawberry_tart.png',
            category: 'Specialty',
            stock: 15,
            ingredients: ['Organic fresh strawberries', 'Cane sugar', 'Organic eggs', 'Unsalted sweet butter', 'Madagascar vanilla beans', 'Wheat flour']
          },
          'mock-4': {
            _id: 'mock-4',
            name: 'Chocolate Fudge Cake',
            price: 28.00,
            description: 'Double-layered rich, dark chocolate cake covered with decadent dark chocolate ganache made from 70% single-origin Belgian chocolate. Velvety, rich, and intensely chocolatey.',
            image: '/images/chocolate_cake.png',
            category: 'Cake',
            stock: 8,
            ingredients: ['Belgian dark chocolate (70% cocoa)', 'Dutched cocoa powder', 'Organic unbleached flour', 'Cane sugar', 'Unsalted butter', 'Farm fresh eggs', 'Cultured buttermilk']
          },
          'mock-5': {
            _id: 'mock-5',
            name: 'Chocolate Chip Cookie',
            price: 2.50,
            description: 'The ultimate cookie experience. Crispy on the edges, chewy and soft in the center, loaded with semi-sweet chocolate chunks, and finished with a light dusting of flaky sea salt.',
            image: '/images/cookie.png',
            category: 'Cookie',
            stock: 50,
            ingredients: ['Wheat flour', 'Semi-sweet chocolate chunks', 'Dark brown sugar', 'Unsalted butter', 'Pasture-raised eggs', 'Vanilla extract', 'Maldon sea salt']
          },
          'mock-6': {
            _id: 'mock-6',
            name: 'Almond Croissant',
            price: 4.50,
            description: 'Traditional twice-baked croissant. Laminated pastry filled with a sweet almond frangipane cream, topped with sliced almonds and dusted with confectioner\'s sugar.',
            image: '/images/almond_croissant.png',
            category: 'Pastry',
            stock: 12,
            ingredients: ['Unbleached pastry flour', 'Cultured French butter', 'Sweet almond flour', 'Powdered sugar', 'Organic eggs', 'Sliced almonds']
          }
        };

        const fallbackItem = mockDatabase[id] || mockDatabase['mock-1'];
        setProduct(fallbackItem);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQtyChange = (val: number) => {
    if (!product) return;
    setQty(Math.max(1, Math.min(val, product.stock)));
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock
    }, qty);

    setAddedNotify(true);
    setTimeout(() => setAddedNotify(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bakery-light">
        <div className="text-center font-serif text-lg text-bakery-chocolate animate-pulse">
          Loading baking secrets...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bakery-light">
        <div className="text-center">
          <h2 className="font-serif text-2xl font-bold text-bakery-chocolate mb-4">Pastry not found</h2>
          <Link href="/products" className="bg-bakery-amber text-white px-6 py-2.5 rounded-full hover:bg-bakery-amberDark transition-colors">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/products"
          className="inline-flex items-center text-sm font-medium text-bakery-chocolate/60 hover:text-bakery-amber mb-10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Menu
        </Link>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Product Image */}
          <div className="relative h-[450px] sm:h-[550px] w-full rounded-3xl overflow-hidden shadow-sm border border-bakery-sand">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                <span className="bg-red-600 text-white font-bold text-sm uppercase px-4 py-2 rounded-full tracking-wider">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Right: Product Content Info */}
          <div className="flex flex-col">
            <div className="border-b border-bakery-sand pb-6 mb-6">
              <span className="text-xs uppercase tracking-widest text-bakery-amber font-semibold mb-2 block">
                {product.category}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bakery-chocolate mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl font-extrabold text-bakery-chocolate">
                  ${product.price.toFixed(2)}
                </span>
                
                {/* Stock Indicator */}
                {product.stock > 0 ? (
                  <span className="inline-flex items-center text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Freshly baked, {product.stock} available
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                    Sold Out
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-bakery-chocolate/85 leading-relaxed mb-8 text-base">
              {product.description}
            </p>

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="bg-[#FAF7F2] border border-bakery-sand rounded-2xl p-6 mb-8">
                <h3 className="font-serif text-base font-bold text-bakery-chocolate mb-3 flex items-center">
                  <Leaf className="w-4 h-4 text-bakery-amber mr-2" />
                  Ingredients &amp; Allergens
                </h3>
                <p className="text-sm text-bakery-chocolate/75 leading-relaxed">
                  {product.ingredients.join(', ')}. Contains gluten and dairy products. Made in a facility that handles nuts.
                </p>
              </div>
            )}

            {/* Add to Cart Actions */}
            {product.stock > 0 && (
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Quantity triggers */}
                <div className="flex items-center justify-between border border-bakery-sand rounded-full px-4 py-3 bg-white w-full sm:w-36">
                  <button
                    onClick={() => handleQtyChange(qty - 1)}
                    className="text-bakery-chocolate/70 hover:text-bakery-chocolate text-xl font-bold px-2 focus:outline-none"
                    disabled={qty <= 1}
                  >
                    -
                  </button>
                  <span className="font-semibold text-bakery-chocolate">{qty}</span>
                  <button
                    onClick={() => handleQtyChange(qty + 1)}
                    className="text-bakery-chocolate/70 hover:text-bakery-chocolate text-xl font-bold px-2 focus:outline-none"
                    disabled={qty >= product.stock}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-grow flex items-center justify-center bg-bakery-chocolate text-white px-8 py-4 rounded-full font-semibold hover:bg-bakery-amber transition-all shadow-md duration-300 hover:shadow hover:scale-102"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart &mdash; ${(product.price * qty).toFixed(2)}
                </button>
              </div>
            )}

            {/* Notifications */}
            {addedNotify && (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 flex items-center text-sm mb-6 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                Successfully added {qty} {product.name}(s) to your cart!
              </div>
            )}

            {/* Delivery banner */}
            <div className="flex items-center space-x-3 text-xs text-bakery-chocolate/65 border-t border-bakery-sand pt-6">
              <ShieldCheck className="w-5 h-5 text-bakery-amber" />
              <span>Available for contact-free storefront pickup or local home delivery.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
