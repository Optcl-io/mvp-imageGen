// components/CoolFooter.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function CoolFooter() {
  return (
    <footer className=" bg-gradient-to-r from-purple-900 to-blue-800 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative h-10 w-10">
                <Image
                  src="/logo.svg"
                  alt="AdCreative Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
                Optcl
              </span>
            </div>
            <p className="text-sm text-indigo-200">
              Elevating brands through stunning visuals and compelling content since 2025.
            </p>
            <div className="flex space-x-4">
              {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                <Link 
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-200 hover:text-white transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <div className="relative h-5 w-5">
                    <Image
                      src={`https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/${social}.svg`}
                      alt={social}
                      fill
                      className="object-contain invert"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', href: '/' },
                { name: 'Services', href: '/services' },
                { name: 'Pricing', href: '/pricing' },
                { name: 'Portfolio', href: '/portfolio' },
                { name: 'Blog', href: '/blog' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-indigo-200 hover:text-white text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Our Services</h3>
            <ul className="space-y-2">
              {[
                'Content Creation',
                'Social Media Ads',
                'Video Production',
                'Brand Strategy',
                'SEO Optimization',
              ].map((service) => (
                <li key={service} className="text-indigo-200 text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-amber-400">Stay Updated</h3>
            <p className="text-sm text-indigo-200 mb-4">
              Subscribe to our newsletter for the latest creative trends.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-l-lg text-gray-900 text-sm focus:outline-none w-full invert border"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-4 py-2 rounded-r-lg text-sm font-medium transition-all"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-indigo-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-indigo-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} Optcl. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-xs text-indigo-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-indigo-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-xs text-indigo-400 hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}