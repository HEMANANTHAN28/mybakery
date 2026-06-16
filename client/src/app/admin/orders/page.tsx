'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { ChevronLeft, ShieldCheck, Clock, AlertCircle, ShoppingCart, User } from 'lucide-react';

interface OrderItem {
  _id: string;
  name: string;
  qty: number;
  price: number;
}

interface Order {
  _id: string;
  createdAt: string;
  user: {
    _id: string;
    name: string;
  };
  orderItems: OrderItem[];
  shippingAddress: string;
  totalPrice: number;
  status: 'Pending' | 'Processing' | 'Ready' | 'Completed' | 'Cancelled';
  isPaid: boolean;
}

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://bakery-backend.onrender.com/api/orders', {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        throw new Error('Failed to load orders');
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      // Fallback mockup items
      setOrders([
        {
          _id: 'mock-ord-1',
          createdAt: new Date().toISOString(),
          user: { _id: 'u-1', name: 'John Doe' },
          orderItems: [
            { _id: 'i-1', name: 'Artisan Sourdough Bread', qty: 2, price: 6.50 },
            { _id: 'i-2', name: 'Classic Butter Croissant', qty: 3, price: 3.75 },
          ],
          shippingAddress: '456 Wheat Ave, Pastry Town',
          totalPrice: 26.19,
          status: 'Pending',
          isPaid: true,
        },
        {
          _id: 'mock-ord-2',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          user: { _id: 'u-2', name: 'Jane Smith' },
          orderItems: [
            { _id: 'i-3', name: 'Strawberry Tart', qty: 1, price: 5.50 },
          ],
          shippingAddress: '123 Baker St, Flour City',
          totalPrice: 5.94,
          status: 'Completed',
          isPaid: true,
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
    fetchOrders();
  }, [user, router]);

  const handleUpdateStatus = async (id: string, newStatus: Order['status']) => {
    try {
      const res = await fetch(`https://bakery-backend.onrender.com/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
        );
      } else {
        throw new Error('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      // Fallback locally
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
      );
      setError('Connection failed. Updated state locally.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const getStatusBadgeColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Processing':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Ready':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'Completed':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'Cancelled':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bakery-light">
        <div className="text-center font-serif text-lg text-bakery-chocolate animate-pulse">
          Opening order tickets...
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

        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-bakery-chocolate flex items-center">
            <ShieldCheck className="w-8 h-8 text-bakery-amber mr-2" />
            Manage Active Orders
          </h1>
          <p className="text-sm text-bakery-chocolate/65 mt-1">Track storefront pickup tickets and process statuses</p>
        </div>

        {/* Global Errors */}
        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm mb-6 flex items-center animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white border border-bakery-sand rounded-3xl overflow-hidden shadow-sm">
          {orders.length === 0 ? (
            <div className="text-center py-20 text-bakery-chocolate/55">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-bakery-chocolate/20" />
              <p className="font-serif text-xl font-bold">No orders placed</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bakery-light border-b border-bakery-sand text-xs uppercase font-semibold text-bakery-chocolate/75 tracking-wider">
                    <th className="p-6">Order ID / Date</th>
                    <th className="p-6">Customer</th>
                    <th className="p-6">Order Items</th>
                    <th className="p-6">Price</th>
                    <th className="p-6">Status Details</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bakery-sand/75 text-sm text-bakery-chocolate/90">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-bakery-light/30 transition-colors">
                      
                      {/* ID / Date */}
                      <td className="p-6">
                        <span className="font-mono font-bold block">#{order._id.slice(-8).toUpperCase()}</span>
                        <span className="text-xs text-bakery-chocolate/65 block mt-1">
                          {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="p-6">
                        <span className="font-semibold block flex items-center">
                          <User className="w-3.5 h-3.5 text-bakery-amber mr-1.5" />
                          {order.user?.name || 'Guest'}
                        </span>
                        <span className="text-xs text-bakery-chocolate/60 block mt-1 max-w-[150px] truncate">{order.shippingAddress}</span>
                      </td>

                      {/* Items */}
                      <td className="p-6">
                        <div className="space-y-1">
                          {order.orderItems.map((item, idx) => (
                            <span key={idx} className="block text-xs text-bakery-chocolate/80">
                              {item.name} <span className="font-semibold">x{item.qty}</span>
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Price */}
                      <td className="p-6 font-semibold">${order.totalPrice.toFixed(2)}</td>

                      {/* Status */}
                      <td className="p-6">
                        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadgeColor(order.status)}`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {order.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-6 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value as Order['status'])}
                          className="px-3 py-1.5 bg-bakery-light border border-bakery-sand rounded-xl text-xs font-semibold text-bakery-chocolate focus:outline-none focus:ring-1 focus:ring-bakery-amber cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Ready">Ready</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
