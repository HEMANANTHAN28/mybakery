'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { DollarSign, ShoppingBag, Users, FolderHeart, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (!user.isAdmin) {
      router.push('/');
      return;
    }

    const fetchStats = async () => {
      try {
        // Fetch products & orders list to aggregate stats
        const [ordersRes, productsRes] = await Promise.all([
          fetch('http://localhost:5000/api/orders', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          fetch('http://localhost:5000/api/products'),
        ]);

        if (ordersRes.ok && productsRes.ok) {
          const orders = await ordersRes.json();
          const products = await productsRes.json();

          const earnings = orders
            .filter((o: any) => o.status !== 'Cancelled')
            .reduce((acc: number, cur: any) => acc + cur.totalPrice, 0);

          setStats({
            totalEarnings: earnings,
            totalOrders: orders.length,
            totalProducts: products.length,
            totalUsers: 3, // Mock user base count
          });
        } else {
          throw new Error('Failed to fetch stats');
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        // Fallback mockup stats
        setStats({
          totalEarnings: 345.50,
          totalOrders: 8,
          totalProducts: 6,
          totalUsers: 4,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bakery-light">
        <div className="text-center font-serif text-lg text-bakery-chocolate animate-pulse">
          Opening admin control vault...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-bakery-sand pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bakery-chocolate flex items-center">
              <ShieldCheck className="w-8 h-8 text-bakery-amber mr-3" />
              Bakery Administration
            </h1>
            <p className="text-sm text-bakery-chocolate/65 mt-1">Gourmet sales metrics and store controls</p>
          </div>
          <span className="text-xs bg-red-50 text-red-700 px-3 py-1.5 border border-red-200 rounded-full font-bold uppercase tracking-wider">
            Admin Mode
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1 */}
          <div className="bg-white border border-bakery-sand rounded-2xl p-6 shadow-sm flex items-center hover-scale">
            <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-green-700 mr-5">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-bakery-chocolate/55 mb-1 font-semibold">Total Revenue</p>
              <h3 className="text-2xl font-bold text-bakery-chocolate">${stats.totalEarnings.toFixed(2)}</h3>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-bakery-sand rounded-2xl p-6 shadow-sm flex items-center hover-scale">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-700 mr-5">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-bakery-chocolate/55 mb-1 font-semibold">Total Orders</p>
              <h3 className="text-2xl font-bold text-bakery-chocolate">{stats.totalOrders}</h3>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-bakery-sand rounded-2xl p-6 shadow-sm flex items-center hover-scale">
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-purple-700 mr-5">
              <FolderHeart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-bakery-chocolate/55 mb-1 font-semibold">Active Menu</p>
              <h3 className="text-2xl font-bold text-bakery-chocolate">{stats.totalProducts} Items</h3>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-bakery-sand rounded-2xl p-6 shadow-sm flex items-center hover-scale">
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-bakery-amber mr-5">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-bakery-chocolate/55 mb-1 font-semibold">User base</p>
              <h3 className="text-2xl font-bold text-bakery-chocolate">{stats.totalUsers} Members</h3>
            </div>
          </div>
        </div>

        {/* Admin Navigation Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Panel 1 */}
          <div className="bg-white border border-bakery-sand rounded-3xl p-8 shadow-sm hover-scale flex flex-col justify-between h-64">
            <div>
              <h2 className="font-serif text-2xl font-bold text-bakery-chocolate mb-3">Menu Catalog CRUD</h2>
              <p className="text-sm text-bakery-chocolate/70 leading-relaxed">
                Add fresh gourmet offerings, edit ingredients or prices, and manage stock inventories for existing pastries.
              </p>
            </div>
            <Link
              href="/admin/products"
              className="bg-bakery-chocolate text-white font-medium px-6 py-3 rounded-full hover:bg-bakery-amber transition-colors flex items-center justify-center text-sm w-fit group"
            >
              Configure Catalog
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Panel 2 */}
          <div className="bg-white border border-bakery-sand rounded-3xl p-8 shadow-sm hover-scale flex flex-col justify-between h-64">
            <div>
              <h2 className="font-serif text-2xl font-bold text-bakery-chocolate mb-3">Order Status Management</h2>
              <p className="text-sm text-bakery-chocolate/70 leading-relaxed">
                Track client checkouts, print packaging details, and progress order statuses from pending preparation to ready for pickup.
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="bg-bakery-chocolate text-white font-medium px-6 py-3 rounded-full hover:bg-bakery-amber transition-colors flex items-center justify-center text-sm w-fit group"
            >
              Manage Orders
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
