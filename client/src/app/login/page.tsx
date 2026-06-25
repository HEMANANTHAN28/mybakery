'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { user, login, error, clearError, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/products');
    }
    return () => {
      clearError();
    };
  }, [user, router, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    const success = await login(email, password);
    if (success) {
      router.push('/products');
    }
  };

  return (
    <div className="bg-bakery-light min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white border border-bakery-sand rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col items-center">
        
        {/* Branding/Header */}
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-3xl font-bold tracking-wide text-bakery-chocolate">
            Amber &amp; Crust
          </Link>
          <p className="text-sm text-bakery-chocolate/65 mt-2">Sign in to manage your fresh orders</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 text-center animate-fadeIn">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-bakery-chocolate/40" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate placeholder-bakery-chocolate/30 focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-bakery-chocolate/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3.5 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate placeholder-bakery-chocolate/30 focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-bakery-chocolate/40 hover:text-bakery-chocolate"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

        {/* Forgot Password */}
        <div className="text-right mb-4">
          <Link
            href="/forgot-password1"
            className="text-red-600 font-bold text-lg"
          >
            Forgot Password?
          </Link>
        </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-bakery-chocolate text-white py-4 rounded-full font-semibold hover:bg-bakery-amber transition-all shadow duration-300 hover:shadow-md disabled:bg-bakery-chocolate/50 flex items-center justify-center text-sm"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Footnote */}
        <div className="mt-8 text-center text-sm text-bakery-chocolate/75">
          Don&#39;t have an account?{' '}
          <Link href="/register" className="font-semibold text-bakery-amber hover:underline">
            Register now
          </Link>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 pt-6 border-t border-bakery-sand w-full text-center text-xs text-bakery-chocolate/60">
          <p className="font-semibold mb-2 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 mr-1 text-bakery-amber" />
            Quick Demo Accounts:
          </p>
          <div className="space-y-1">
            <p>Admin: <span className="font-bold text-bakery-chocolate">admin@bakery.com</span> / <span className="font-bold text-bakery-chocolate">admin123</span></p>
            <p>Customer: <span className="font-bold text-bakery-chocolate">user@bakery.com</span> / <span className="font-bold text-bakery-chocolate">user123</span></p>
          </div>
        </div>

      </div>
    </div>
  );
}
