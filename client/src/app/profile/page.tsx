'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, User, Mail, Phone, MapPin, Lock, Save, AlertCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile, error, clearError, loading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone || '');
    setAddress(user.address || '');
    return () => {
      clearError();
    };
  }, [user, router, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccess(false);

    if (password && password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    const payload: any = { name, email, phone, address };
    if (password) {
      payload.password = password;
    }

    const success = await updateProfile(payload);
    if (success) {
      setSuccess(true);
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="bg-[#FFFDF9] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bakery-chocolate mb-2">My Profile Settings</h1>
        <p className="text-bakery-chocolate/65 mb-10">Configure your contact coordinates and security settings</p>

        {/* Alerts */}
        {(error || localError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-center animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
            <span>{localError || error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm mb-6 flex items-center animate-fadeIn">
            <ShieldCheck className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
            <span>Profile settings updated successfully!</span>
          </div>
        )}

        {/* Settings Box */}
        <div className="bg-white border border-bakery-sand rounded-3xl p-6 sm:p-10 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-bakery-chocolate/40" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate placeholder-bakery-chocolate/30 focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-bakery-chocolate/40" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate placeholder-bakery-chocolate/30 focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 w-4 h-4 text-bakery-chocolate/40" />
                  <input
                    type="tel"
                    placeholder="e.g. 123-456-7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate placeholder-bakery-chocolate/30 focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
                  Delivery Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-bakery-chocolate/40" />
                  <input
                    type="text"
                    placeholder="e.g. 123 Pastry Ln, Sugar Land"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate placeholder-bakery-chocolate/30 focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 border-t border-bakery-sand pt-6 mt-2">
                <h3 className="font-serif text-lg font-bold text-bakery-chocolate mb-4">Change Password</h3>
                <p className="text-xs text-bakery-chocolate/60 mb-4">Leave fields blank if you do not want to modify your password</p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-bakery-chocolate/40" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate placeholder-bakery-chocolate/30 focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-bakery-chocolate/75 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-bakery-chocolate/40" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-bakery-light border border-bakery-sand rounded-xl text-bakery-chocolate placeholder-bakery-chocolate/30 focus:outline-none focus:ring-1 focus:ring-bakery-amber text-sm transition-all"
                  />
                </div>
              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-bakery-chocolate text-white px-8 py-3.5 rounded-full font-semibold hover:bg-bakery-amber transition-all shadow duration-300 flex items-center justify-center text-sm ml-auto cursor-pointer"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving details...' : 'Save Settings'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
