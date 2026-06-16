'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, CreditCard, ShieldCheck, CheckCircle2, ShoppingBag } from 'lucide-react';

export default function CheckoutPage() {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const estimatedTax = cartSubtotal * 0.08;
  const grandTotal = cartSubtotal + estimatedTax;

  // Pre-fill details from user context
  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=checkout');
      return;
    }
    if (user.address) setAddress(user.address);
    if (user.phone) setPhone(user.phone);
  }, [user, router]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!address || !phone || !cardNumber || !cardExpiry || !cardCvv || !cardName) {
      setError('Please fill in all checkout fields');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your shopping cart is empty');
      return;
    }

    setLoading(true);

    try {
      const formattedItems = cartItems.map((item) => ({
        product: item.product,
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
      }));

      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          orderItems: formattedItems,
          shippingAddress: address,
          paymentMethod: 'Card',
          totalPrice: grandTotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error placing order');
      }

      setSuccess(true);
      clearCart();
      setTimeout(() => {
        router.push('/orders');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#FFFDF9] min-h-[80vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center bg-white border border-bakery-sand rounded-3xl p-8 sm:p-12 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h2 className="font-serif text-3xl font-bold text-bakery-chocolate mb-3">Order Confirmed!</h2>
          <p className="text-[#8C7A6B] text-sm mb-4 leading-relaxed">
            Thank you for your order! Our bakers have received your request and are beginning preparation.
          </p>
          <p className="text-xs text-bakery-amber font-semibold">Redirecting to order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/cart"
          className="inline-flex items-center text-sm font-medium text-bakery-chocolate/60 hover:text-bakery-amber mb-10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Cart
        </Link>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bakery-chocolate mb-10">Artisan Checkout</h1>

        {/* Error Box */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-8 text-center max-w-4xl mx-auto">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          
          {/* Left: Input Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Delivery Details */}
              <div className="bg-white border border-bakery-sand rounded-3xl p-6 sm:p-8 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-bakery-chocolate mb-6 border-b border-bakery-sand pb-3">
                  1. Delivery &amp; Contact Details
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Delivery Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
                      Storefront Pickup / Delivery Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 456 Wheat Ave, Pastry Town"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate placeholder-bakery-chocolate/30 focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
                      Contact Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 123-456-7890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate placeholder-bakery-chocolate/30 focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-white border border-bakery-sand rounded-3xl p-6 sm:p-8 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-bakery-chocolate mb-6 border-b border-bakery-sand pb-3 flex items-center">
                  <CreditCard className="w-5 h-5 text-bakery-amber mr-2" />
                  2. Credit Card Payment (Simulated)
                </h2>
                
                <div className="space-y-6">
                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-4 py-3 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate placeholder-bakery-chocolate/30 focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
                    />
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
                      Credit Card Number
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={16}
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate placeholder-bakery-chocolate/30 focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
                    />
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={5}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-4 py-3 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate placeholder-bakery-chocolate/30 focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
                        Security Code (CVV)
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate placeholder-bakery-chocolate/30 focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-bakery-chocolate text-white py-4 rounded-full font-semibold hover:bg-bakery-amber transition-all shadow duration-300 hover:shadow-md disabled:bg-bakery-chocolate/50 flex items-center justify-center text-sm"
              >
                {loading ? 'Processing Transaction...' : `Authorize & Place Order — $${grandTotal.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Right: Summary Sidebar */}
          <div className="bg-white border border-bakery-sand rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col">
            <h2 className="font-serif text-xl font-bold text-bakery-chocolate border-b border-bakery-sand pb-4 mb-6 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2 text-bakery-amber" />
              Order Items
            </h2>
            
            {/* Basket Items List */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 mb-6 border-b border-bakery-sand pb-6">
              {cartItems.map((item) => (
                <div key={item.product} className="flex justify-between items-center text-sm">
                  <div className="flex flex-col">
                    <span className="font-semibold text-bakery-chocolate">{item.name}</span>
                    <span className="text-xs text-bakery-chocolate/60">Qty: {item.qty} x ${item.price.toFixed(2)}</span>
                  </div>
                  <span className="font-bold text-bakery-chocolate">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-3 text-xs text-bakery-chocolate/75 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between text-base font-bold text-bakery-chocolate border-t border-bakery-sand pt-4">
              <span>Total Price</span>
              <span className="text-bakery-amber">${grandTotal.toFixed(2)}</span>
            </div>

            {/* Shield Notice */}
            <div className="flex items-center space-x-2 text-[10px] text-bakery-chocolate/60 mt-6 justify-center">
              <ShieldCheck className="w-4 h-4 text-bakery-amber" />
              <span>Encrypted with bank-level SSL validation protocols.</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
