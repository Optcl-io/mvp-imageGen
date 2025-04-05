'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NewsletterSubscribeProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function NewsletterSubscribe({
  title = 'Stay updated with our newsletter',
  subtitle = 'Subscribe to receive the latest news, updates, and tips from OPTCL.',
  className = '',
}: NewsletterSubscribeProps) {
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeError, setSubscribeError] = useState('');
  const [emailSubscribed, setEmailSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscribeLoading(true);
    setSubscribeError('');
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: subscribeEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setEmailSubscribed(true);
      setSubscribeEmail('');
    } catch (error) {
      setSubscribeError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setSubscribeLoading(false);
    }
  };

  return (
    <div className={`rounded-lg p-8 ${className}`}>
      <div className="flex flex-col items-center justify-center max-w-3xl mx-auto text-center">
        <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
        <p className="mt-3 text-[15px] text-gray-700">{subtitle}</p>
        
        {emailSubscribed ? (
          <div className="p-4 mt-8 border border-green-200 rounded-md bg-green-50">
            <p className="text-sm text-green-400">
              Thank you for subscribing! You&apos;ll start receiving our newsletter soon.
            </p>
            <button
              onClick={() => setEmailSubscribed(false)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-500"
            >
              Subscribe another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="mt-8 sm:flex">
            <label htmlFor="subscribe-email" className="sr-only">
              Email address
            </label>
            <input
              id="subscribe-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              className="w-full px-5 py-3 text-black placeholder-gray-900 border border-gray-900 rounded-l-md focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs"
              placeholder="Enter your email"
            />
            <div className="mt-3 shadow rounded-r-md sm:mt-0 sm:flex-shrink-0">
              <button
                type="submit"
                disabled={subscribeLoading}
                className="flex items-center justify-center w-full px-5 py-3 text-base font-medium text-white bg-blue-600 border border-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {subscribeLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </form>
        )}
        
        {subscribeError && (
          <div className="p-3 mt-3 text-sm text-red-800 border border-red-200 rounded-md bg-red-50">
            {subscribeError}
          </div>
        )}
        
        <p className="mt-3 text-sm text-gray-700">
          We care about your data. Read our{' '}
          <Link href="/privacy" className="font-medium text-blue-400 hover:text-blue-500">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
} 