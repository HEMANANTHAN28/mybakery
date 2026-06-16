'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, Clock, Heart, Award } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

const CATEGORIES = [
  { name: 'Bread', image: '/images/sourdough.png', count: '10+ Items' },
  { name: 'Pastry', image: '/images/croissant.png', count: '15+ Items' },
  { name: 'Cake', image: '/images/chocolate_cake.png', count: '8+ Items' },
  { name: 'Specialty', image: '/images/strawberry_tart.png', count: '6+ Items' },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products?featured=true');
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
        // Fallback mock featured items if server is not running
        setFeaturedProducts([
          {
            _id: 'mock-1',
            name: 'Artisan Sourdough Bread',
            price: 6.50,
            description: 'Traditional slow-fermented sourdough with a crispy crust and soft, airy crumb.',
            image: '/images/sourdough.png',
            category: 'Bread',
          },
          {
            _id: 'mock-2',
            name: 'Classic Butter Croissant',
            price: 3.75,
            description: 'Flaky, golden-brown puff pastry made with premium cultured French butter.',
            image: '/images/croissant.png',
            category: 'Pastry',
          },
          {
            _id: 'mock-3',
            name: 'Strawberry Tart',
            price: 5.50,
            description: 'Sweet pastry crust filled with vanilla pastry cream and topped with fresh organic strawberries.',
            image: '/images/strawberry_tart.png',
            category: 'Specialty',
          },
          {
            _id: 'mock-4',
            name: 'Chocolate Fudge Cake',
            price: 28.00,
            description: 'Decadent double-layered chocolate cake iced with rich Belgian dark chocolate ganache.',
            image: '/images/chocolate_cake.png',
            category: 'Cake',
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-bakery-chocolate text-white overflow-hidden">
        {/* Background image overlay */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="/images/hero_bakery.png"
            alt="Amber & Crust Interior"
            fill
            priority
            className="object-cover"
          />
        </div>
        
        {/* Dark gradient shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-bakery-chocolate via-bakery-chocolate/60 to-transparent z-10" />

        <div className="relative z-20 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 mt-10">
          <span className="text-bakery-amber font-semibold uppercase tracking-[0.25em] text-xs sm:text-sm block mb-4">
            Baked Fresh Daily Since 2012
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
            Artisan Baking, <br />
            <span className="text-[#ECE0D1]">Refined Taste.</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#D5C3B2] max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience the warmth of naturally leavened sourdough bread and delicate, buttery pastries hand-rolled by master bakers every morning.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/products"
              className="w-full sm:w-auto bg-bakery-amber text-white font-medium px-8 py-4 rounded-full shadow hover:bg-bakery-amberDark transition-all hover:scale hover-scale flex items-center justify-center"
            >
              Order Online
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/products?category=Bread"
              className="w-full sm:w-auto border border-[#ECE0D1] text-[#ECE0D1] font-medium px-8 py-4 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              Browse Breads
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-bakery-sand py-10 border-y border-bakery-tan">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Clock className="w-8 h-8 text-bakery-amber mb-3" />
            <h3 className="font-serif text-lg font-bold text-bakery-chocolate mb-1">Morning Sourdough</h3>
            <p className="text-sm text-bakery-chocolate/75 max-w-xs">Naturally leavened for over 24 hours, baked fresh at 4:00 AM daily.</p>
          </div>
          <div className="flex flex-col items-center">
            <Award className="w-8 h-8 text-bakery-amber mb-3" />
            <h3 className="font-serif text-lg font-bold text-bakery-chocolate mb-1">Selected Ingredients</h3>
            <p className="text-sm text-bakery-chocolate/75 max-w-xs">Stone-ground organic flours, French butter, and seasonal local fruits.</p>
          </div>
          <div className="flex flex-col items-center">
            <Heart className="w-8 h-8 text-bakery-amber mb-3" />
            <h3 className="font-serif text-lg font-bold text-bakery-chocolate mb-1">Hand-rolled Pastry</h3>
            <p className="text-sm text-bakery-chocolate/75 max-w-xs">No shortcuts. Traditional laminating techniques for a flaky finish.</p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-bakery-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">Our Specialty Menu</h2>
            <div className="w-16 h-1 bg-bakery-amber mx-auto mb-4" />
            <p className="text-bakery-chocolate/70 max-w-md mx-auto">Explore our gourmet selection of slow-baked breads, layered pastries, and elegant custom tarts.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={i}
                href={`/products?category=${cat.name}`}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover-scale"
              >
                <div className="absolute inset-0 z-0">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bakery-chocolate/85 via-bakery-chocolate/40 to-transparent z-10" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 z-20 text-white">
                  <span className="text-bakery-amber text-[10px] tracking-widest font-semibold uppercase block mb-1">
                    {cat.count}
                  </span>
                  <h3 className="font-serif text-2xl font-bold tracking-wide">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-[#FAF7F2] border-t border-bakery-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12">
            <div>
              <span className="text-bakery-amber font-semibold uppercase tracking-wider text-xs block mb-2">Chef&#39;s Selection</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold">Featured Delicacies</h2>
            </div>
            <Link
              href="/products"
              className="mt-4 sm:mt-0 font-medium text-bakery-amber hover:text-bakery-chocolate transition-colors flex items-center group text-sm"
            >
              View Full Menu
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-bakery-sand h-96 rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
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
                      <span className="bg-bakery-light text-bakery-chocolate group-hover:bg-bakery-amber group-hover:text-white p-2.5 rounded-full transition-all shadow-sm">
                        <ShoppingBag className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-bakery-chocolate text-white text-center relative overflow-hidden border-t border-bakery-chocolate">
        <div className="absolute inset-0 bg-[radial-gradient(#4E3629_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-bakery-amber text-xs uppercase tracking-widest font-semibold block mb-4">Testimonials</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-10">What Our Patrons Say</h2>
          <blockquote className="text-xl sm:text-2xl font-serif italic text-[#ECE0D1] mb-8 leading-relaxed">
            &#34;The artisan sourdough is unmatched in texture and taste. Every bite of their butter croissant takes me straight back to my favorite bakery in Paris. Truly a neighborhood treasure!&#34;
          </blockquote>
          <cite className="font-sans font-semibold text-sm tracking-wider uppercase text-bakery-amber block">
            &mdash; Eleanor Vance, Flour City Food Critic
          </cite>
        </div>
      </section>
    </div>
  );
}
