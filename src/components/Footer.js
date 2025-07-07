'use client';

import Link from 'next/link';
import { FiHome, FiShoppingBag, FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FiHome className="text-blue-400 text-2xl" />
              <h3 className="text-xl font-bold">EProperty</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted platform for buying, selling, and renting properties. 
              We connect property seekers with their dream homes and help sellers 
              reach the right buyers.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Properties Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Properties</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/properties" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/properties/create" className="text-gray-300 hover:text-white transition-colors text-sm">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/properties/my-properties" className="text-gray-300 hover:text-white transition-colors text-sm">
                  My Properties
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Property Valuation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Market Trends
                </a>
              </li>
            </ul>
          </div>

          {/* Items Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Marketplace</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/items" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link href="/items/create" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Sell an Item
                </Link>
              </li>
              <li>
                <Link href="/items/my-items" className="text-gray-300 hover:text-white transition-colors text-sm">
                  My Items
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Categories
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Selling Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FiMapPin className="text-blue-400 flex-shrink-0" size={16} />
                <span className="text-gray-300 text-sm">
                  123 Property Street<br />
                  Mumbai, Maharashtra 400001
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="text-blue-400 flex-shrink-0" size={16} />
                <a 
                  href="tel:+919876543210" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FiMail className="text-blue-400 flex-shrink-0" size={16} />
                <a 
                  href="mailto:support@eproperty.com" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  support@eproperty.com
                </a>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Stay Updated</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-r-md transition-colors text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} EProperty. All rights reserved.
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Help Center
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 