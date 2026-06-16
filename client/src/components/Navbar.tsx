'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, User as UserIcon, Menu, X, ChevronDown, ShieldAlert } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass-card bg-bakery-light/85 border-b border-bakery-sand shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex flex-col">
              <span className="font-serif text-2xl tracking-wide text-bakery-chocolate">
                Amber &amp; Crust
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-bakery-amber font-semibold">
                Artisan Patisserie
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-bakery-chocolate hover:text-bakery-amber font-medium transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-bakery-chocolate hover:text-bakery-amber font-medium transition-colors">
              Menu
            </Link>

            {user?.isAdmin && (
              <Link href="/admin" className="flex items-center text-red-700 hover:text-red-900 font-medium transition-colors bg-red-50 px-3 py-1 rounded-full border border-red-200">
                <ShieldAlert className="w-4 h-4 mr-1" />
                Admin Dashboard
              </Link>
            )}
          </div>

          {/* Cart & Auth Controls */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Cart Link */}
            <Link href="/cart" className="relative p-2 text-bakery-chocolate hover:text-bakery-amber transition-colors">
              <ShoppingBag className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-bakery-amber rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {/* Auth Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 text-bakery-chocolate hover:text-bakery-amber font-medium transition-colors focus:outline-none"
                >
                  <UserIcon className="w-5 h-5" />
                  <span>{user.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white border border-bakery-sand rounded-xl shadow-lg py-2 z-50">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-bakery-chocolate hover:bg-bakery-light hover:text-bakery-amber"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-bakery-chocolate hover:bg-bakery-light hover:text-bakery-amber"
                    >
                      Order History
                    </Link>
                    <hr className="border-bakery-sand my-1" />
                    <button
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-bakery-chocolate text-white px-5 py-2.5 rounded-full font-medium hover:bg-bakery-amber transition-all shadow-sm duration-300 hover:shadow"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-4">
            <Link href="/cart" className="relative p-2 text-bakery-chocolate hover:text-bakery-amber transition-colors">
              <ShoppingBag className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-bakery-amber rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-bakery-chocolate hover:text-bakery-amber p-2 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-bakery-light border-t border-bakery-sand px-4 pt-4 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-bakery-chocolate hover:text-bakery-amber font-medium py-2"
          >
            Home
          </Link>
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-bakery-chocolate hover:text-bakery-amber font-medium py-2"
          >
            Menu
          </Link>

          {user?.isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-red-600 font-medium py-2 border-t border-bakery-sand pt-3"
            >
              Admin Dashboard
            </Link>
          )}

          <hr className="border-bakery-sand my-2" />

          {user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-bakery-chocolate hover:text-bakery-amber font-medium py-2"
              >
                My Profile
              </Link>
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-bakery-chocolate hover:text-bakery-amber font-medium py-2"
              >
                Order History
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-red-600 font-medium py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-center bg-bakery-chocolate text-white py-3 rounded-full font-medium"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
