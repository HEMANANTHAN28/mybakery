'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, ChevronRight, CheckCircle2, AlertCircle, Clock, Calendar } from 'lucide-react';

interface OrderItem {
  _id: string;
  name: string;
  qty: number;
  image: string;
  price: number;
}

interface Order {
  _id: string;
  createdAt: string;
  orderItems: OrderItem[];
  shippingAddress: string;
  totalPrice: number;
  status: 'Pending' | 'Processing' | 'Ready' | 'Completed' | 'Cancelled';
  isPaid: boolean;
  paidAt?: string;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch('https://mybakery.onrender.com/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          throw new Error('Failed to fetch orders');
        }
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError('Could not retrieve orders. Connect to the API server.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, router]);

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
          Loading your order history...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bakery-chocolate mb-2">My Orders</h1>
        <p className="text-bakery-chocolate/65 mb-10">Track your order statuses and bakery pickup tickets</p>

        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm mb-8 flex items-center">
            <AlertCircle className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0" />
            <span>{error} (Simulating Empty State)</span>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white border border-bakery-sand rounded-3xl shadow-sm">
            <ShoppingBag className="w-16 h-16 text-bakery-chocolate/20 mx-auto mb-4" />
            <h3 className="font-serif text-2xl font-bold text-bakery-chocolate mb-2">No orders placed yet</h3>
            <p className="text-bakery-chocolate/65 max-w-sm mx-auto mb-8">Ready to order? Choose from our menu of fresh baked sourdoughs and French croissants.</p>
            <Link href="/products" className="bg-bakery-chocolate text-white px-8 py-3.5 rounded-full font-semibold hover:bg-bakery-amber transition-colors shadow-sm">
              Explore Our Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-bakery-sand rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col hover-scale"
              >
                {/* Header: Order ID & Date & Status */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-bakery-sand pb-4 mb-6">
                  <div>
                    <span className="text-xs text-bakery-chocolate/55 font-mono">ORDER #{order._id.slice(-8).toUpperCase()}</span>
                    <div className="flex items-center text-sm text-bakery-chocolate/75 mt-1">
                      <Calendar className="w-4 h-4 mr-1.5 text-bakery-amber" />
                      <span>{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Badge */}
                    <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border ${getStatusBadgeColor(order.status)}`}>
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {order.status}
                    </span>

                    {/* Paid Badge */}
                    {order.isPaid ? (
                      <span className="inline-flex items-center text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                        Unpaid
                      </span>
                    )}
                  </div>
                </div>

                {/* Items breakdown list */}
                <div className="space-y-4 mb-6">
                  {order.orderItems.map((item) => (
                    <div key={item._id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-bakery-sand">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="font-semibold text-bakery-chocolate">{item.name}</p>
                          <p className="text-xs text-bakery-chocolate/60">Qty: {item.qty} x ${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <span className="font-bold text-bakery-chocolate">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Footer details: Address & Total */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-bakery-sand text-sm text-bakery-chocolate/75">
                  <p>
                    <span className="font-semibold text-bakery-chocolate">Pickup Details:</span> {order.shippingAddress}
                  </p>
                  <p className="text-base font-bold text-bakery-chocolate">
                    Total Charged: <span className="text-bakery-amber text-lg">${order.totalPrice.toFixed(2)}</span>
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
