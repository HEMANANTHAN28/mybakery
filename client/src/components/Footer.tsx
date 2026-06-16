import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-bakery-chocolate text-[#ECE0D1] border-t border-bakery-chocolate pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand */}
        <div className="md:col-span-2">
          <Link href="/" className="flex flex-col mb-4">
            <span className="font-serif text-3xl tracking-wide text-white">
              Amber &amp; Crust
            </span>
            <span className="text-xs tracking-[0.2em] uppercase text-bakery-amber font-semibold">
              Artisan Patisserie
            </span>
          </Link>
          <p className="text-[#D5C3B2] text-sm max-w-sm mb-6 leading-relaxed">
            Crafting premium hand-rolled croissants, naturally leavened sourdough bread, and exquisite specialty tarts fresh daily in our brick ovens.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-serif text-lg font-semibold mb-4">Explore</h4>
          <ul className="space-y-2.5 text-sm text-[#D5C3B2]">
            <li>
              <Link href="/" className="hover:text-bakery-amber transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-bakery-amber transition-colors">Our Menu</Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-bakery-amber transition-colors">Shopping Cart</Link>
            </li>
          </ul>
        </div>

        {/* Hours & Contact */}
        <div>
          <h4 className="text-white font-serif text-lg font-semibold mb-4">Hours &amp; Location</h4>
          <div className="text-sm text-[#D5C3B2] space-y-2">
            <p>123 Baker St, Flour City</p>
            <p className="pt-2 text-white font-medium">Baking Hours:</p>
            <p>Mon – Fri: 7:00 AM – 6:00 PM</p>
            <p>Sat – Sun: 8:00 AM – 4:00 PM</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#4E3629] pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-[#9E8E7F]">
        <p>&copy; {new Date().getFullYear()} Amber &amp; Crust. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Made with flour, water, salt, and love.</p>
      </div>
    </footer>
  );
};

export default Footer;
