'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingBag, SlidersHorizontal, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
}

const CATEGORIES = ['All', 'Bread', 'Pastry', 'Cake', 'Cookie', 'Specialty'];

function ProductsListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(40);

  // Read initial query params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && CATEGORIES.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = 'https://mybakery.onrender.com/api/products';
        const params = new URLSearchParams();
        
        if (selectedCategory !== 'All') {
          params.append('category', selectedCategory);
        }
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          // Filter by price client-side
          setProducts(data.filter((p: Product) => p.price <= maxPrice));
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        // Fallback mock database
        const mockData: Product[] = [
          {
            _id: 'mock-1',
            name: 'Artisan Sourdough Bread',
            price: 6.50,
            description: 'Traditional slow-fermented sourdough with a crispy crust and soft, airy crumb.',
            image: '/images/sourdough.png',
            category: 'Bread',
            stock: 20
          },
          {
            _id: 'mock-2',
            name: 'Classic Butter Croissant',
            price: 3.75,
            description: 'Flaky, golden-brown puff pastry made with premium cultured French butter.',
            image: '/images/croissant.png',
            category: 'Pastry',
            stock: 30
          },
          {
            _id: 'mock-3',
            name: 'Strawberry Tart',
            price: 5.50,
            description: 'Sweet pastry crust filled with vanilla pastry cream and topped with fresh organic strawberries.',
            image: '/images/strawberry_tart.png',
            category: 'Specialty',
            stock: 15
          },
          {
            _id: 'mock-4',
            name: 'Chocolate Fudge Cake',
            price: 28.00,
            description: 'Decadent double-layered chocolate cake iced with rich Belgian dark chocolate ganache.',
            image: '/images/chocolate_cake.png',
            category: 'Cake',
            stock: 8
          },
          {
            _id: 'mock-5',
            name: 'Chocolate Chip Cookie',
            price: 2.50,
            description: 'Chewy, soft-baked cookies loaded with semi-sweet chocolate chunks and topped with sea salt.',
            image: '/images/cookie.png',
            category: 'Cookie',
            stock: 50
          },
          {
            _id: 'mock-6',
            name: 'Almond Croissant',
            price: 4.50,
            description: 'Twice-baked butter croissant filled with sweet almond frangipane cream and topped with sliced almonds.',
            image: '/images/almond_croissant.png',
            category: 'Pastry',
            stock: 12
          }
        ];

        // Apply filters locally on mock data
        let filtered = mockData;
        if (selectedCategory !== 'All') {
          filtered = filtered.filter((p) => p.category === selectedCategory);
        }
        if (searchTerm) {
          filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        filtered = filtered.filter((p) => p.price <= maxPrice);

        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchTerm, maxPrice]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Sync URL query
    if (category === 'All') {
      router.push('/products');
    } else {
      router.push(`/products?category=${category}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    addToCart({
      product: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock
    }, 1);
  };

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-10">
          <span className="text-bakery-amber font-semibold uppercase tracking-wider text-xs">Menu Catalog</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-bakery-chocolate mt-2">Our Fresh Baked Offerings</h1>
          <div className="w-16 h-1 bg-bakery-amber mx-auto mt-4" />
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-white border border-bakery-sand rounded-2xl p-4 shadow-sm">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-bakery-chocolate/40" />
            <input
              type="text"
              placeholder="Search croissants, sourdough, cakes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate placeholder-bakery-chocolate/40 focus:outline-none focus:ring-1 focus:ring-bakery-amber transition-all"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 border border-bakery-sand hover:border-bakery-amber px-4 py-3 rounded-xl transition-colors text-bakery-chocolate font-medium bg-bakery-light"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Expandable Price/Filter Drawer */}
        {showFilters && (
          <div className="bg-white border border-bakery-sand rounded-2xl p-6 mb-8 shadow-sm animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-lg font-bold text-bakery-chocolate">Filter Customizations</h3>
              <button onClick={() => setShowFilters(false)} className="text-bakery-chocolate/50 hover:text-bakery-chocolate">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-64">
              <label className="block text-sm font-medium text-bakery-chocolate/80 mb-2">
                Max Price: <span className="font-bold text-bakery-amber">${maxPrice}</span>
              </label>
              <input
                type="range"
                min="2"
                max="40"
                step="0.5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-bakery-amber cursor-pointer"
              />
              <div className="flex justify-between text-xs text-bakery-chocolate/50 mt-1">
                <span>$2.00</span>
                <span>$40.00</span>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab Bar */}
        <div className="flex overflow-x-auto pb-4 mb-10 scrollbar-hide space-x-3 border-b border-bakery-sand">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategorySelect(category)}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-bakery-chocolate text-white shadow-sm'
                  : 'bg-white border border-bakery-sand text-bakery-chocolate hover:bg-bakery-light'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-bakery-sand h-96 rounded-2xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white border border-bakery-sand rounded-2xl shadow-sm">
            <ShoppingBag className="w-16 h-16 text-bakery-chocolate/20 mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold text-bakery-chocolate mb-2">No baked goods found</h3>
            <p className="text-bakery-chocolate/65 max-w-sm mx-auto">Try clearing your search term, adjusting your category filter, or reducing the price filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setMaxPrice(40);
              }}
              className="mt-6 bg-bakery-amber text-white font-medium px-6 py-2.5 rounded-full hover:bg-bakery-amberDark transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover-scale flex flex-col h-full border border-bakery-sand"
              >
                <div className="relative h-64 w-full bg-bakery-sand overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
                      <span className="bg-red-600 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-full tracking-wider">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-bakery-amber font-semibold mb-1 block">
                      {product.category}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-bakery-chocolate mb-2 group-hover:text-bakery-amber transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-bakery-chocolate/70 line-clamp-2 leading-relaxed mb-4">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-bakery-light">
                    <span className="text-lg font-bold text-bakery-chocolate">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.stock > 0 ? (
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="bg-bakery-light text-bakery-chocolate hover:bg-bakery-amber hover:text-white p-2.5 rounded-full transition-all shadow-sm"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-xs text-red-600 font-semibold uppercase">Restocking soon</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bakery-light">
        <div className="text-center font-serif text-xl text-bakery-chocolate animate-pulse">
          Loading our menu...
        </div>
      </div>
    }>
      <ProductsListContent />
    </Suspense>
  );
}
