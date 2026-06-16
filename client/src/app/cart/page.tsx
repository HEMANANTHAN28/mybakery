'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Trash2, ArrowRight, ShoppingCart, ShieldCheck, Heart } from 'lucide-react';

export default function CartPage() {
  const { cartItems, cartSubtotal, updateQty, removeFromCart } = useCart();
  const { user } = useAuth();

  const pickupFee = 0.00;
  const estimatedTax = cartSubtotal * 0.08; // 8% sales tax
  const cartTotal = cartSubtotal + estimatedTax + pickupFee;

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#FFFDF9] min-h-[75vh] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center bg-white border border-bakery-sand rounded-3xl p-8 sm:p-12 shadow-sm">
          <ShoppingCart className="w-16 h-16 text-bakery-chocolate/20 mx-auto mb-6" />
          <h2 className="font-serif text-3xl font-bold text-bakery-chocolate mb-3">Your cart is empty</h2>
          <p className="text-[#8C7A6B] text-sm mb-8 leading-relaxed">
            It looks like you haven&#39;t added any gourmet loaves or flaky pastries to your cart yet. Let&#39;s change that!
          </p>
          <Link
            href="/products"
            className="inline-flex bg-bakery-chocolate text-white px-8 py-3.5 rounded-full font-semibold hover:bg-bakery-amber transition-colors shadow duration-300"
          >
            Browse Our Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bakery-chocolate mb-10">Your Baking Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          
          {/* Left: Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="bg-white border border-bakery-sand rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-center gap-4 sm:gap-6 hover-scale hover:shadow"
              >
                {/* Item Image */}
                <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-bakery-sand flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-serif text-lg font-bold text-bakery-chocolate mb-1 hover:text-bakery-amber transition-colors">
                    <Link href={`/products/${item.product}`}>{item.name}</Link>
                  </h3>
                  <span className="text-xs text-bakery-chocolate/60 bg-bakery-light border border-bakery-sand px-2 py-0.5 rounded-full">
                    Price: ${item.price.toFixed(2)}
                  </span>
                  
                  {/* Stock limit check info */}
                  {item.qty >= item.stock && (
                    <p className="text-[10px] text-red-600 font-semibold mt-1">Maximum available stock reached</p>
                  )}
                </div>

                {/* Quantity and Actions */}
                <div className="flex items-center gap-6 justify-between w-full sm:w-auto">
                  {/* Quantity controls */}
                  <div className="flex items-center justify-between border border-bakery-sand rounded-full px-3 py-1.5 bg-bakery-light w-28">
                    <button
                      onClick={() => updateQty(item.product, item.qty - 1)}
                      className="text-bakery-chocolate/70 hover:text-bakery-chocolate font-bold px-1.5 text-sm"
                      disabled={item.qty <= 1}
                    >
                      -
                    </button>
                    <span className="font-semibold text-sm text-bakery-chocolate">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.product, item.qty + 1)}
                      className="text-bakery-chocolate/70 hover:text-bakery-chocolate font-bold px-1.5 text-sm"
                      disabled={item.qty >= item.stock}
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <span className="font-bold text-bakery-chocolate text-base min-w-[60px] text-right">
                    ${(item.price * item.qty).toFixed(2)}
                  </span>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeFromCart(item.product)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Summary Sidebar */}
          <div className="bg-white border border-bakery-sand rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col">
            <h2 className="font-serif text-2xl font-bold text-bakery-chocolate border-b border-bakery-sand pb-4 mb-6">
              Order Summary
            </h2>
            
            {/* Calculation Lines */}
            <div className="space-y-4 text-sm text-bakery-chocolate/85 border-b border-bakery-sand pb-6 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax (8%)</span>
                <span className="font-semibold">${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Storefront Pickup</span>
                <span className="font-semibold text-green-700">FREE</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between text-lg font-bold text-bakery-chocolate mb-8">
              <span>Estimated Total</span>
              <span className="text-bakery-amber text-xl">${cartTotal.toFixed(2)}</span>
            </div>

            {/* Checkout CTA */}
            {user ? (
              <Link
                href="/checkout"
                className="w-full bg-bakery-chocolate text-white py-4 rounded-full font-semibold hover:bg-bakery-amber transition-all shadow duration-300 hover:shadow-md flex items-center justify-center text-sm"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            ) : (
              <Link
                href="/login?redirect=checkout"
                className="w-full bg-bakery-amber text-white py-4 rounded-full font-semibold hover:bg-bakery-chocolate transition-all shadow duration-300 flex items-center justify-center text-sm"
              >
                Sign In to Checkout
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            )}

            {/* Pickup note */}
            <div className="flex items-center space-x-2.5 text-xs text-bakery-chocolate/65 mt-6 justify-center">
              <ShieldCheck className="w-4 h-4 text-bakery-amber" />
              <span>Secure checkout. Fresh pickup ready today.</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
