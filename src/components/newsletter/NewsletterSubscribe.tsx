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
    <div className={`bg-blue-50 rounded-lg p-8 ${className}`}>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-extrabold text-gray-900">{title}</h2>
        <p className="mt-3 text-lg text-gray-500">{subtitle}</p>
        
        {emailSubscribed ? (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-md p-4">
            <p className="text-sm text-green-800">
              Thank you for subscribing! You'll start receiving our newsletter soon.
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
              className="w-full px-5 py-3 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs border-gray-300 rounded-md"
              placeholder="Enter your email"
            />
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
              <button
                type="submit"
                disabled={subscribeLoading}
                className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {subscribeLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </form>
        )}
        
        {subscribeError && (
          <div className="mt-3 bg-red-50 border border-red-200 text-red-800 rounded-md p-3 text-sm">
            {subscribeError}
          </div>
        )}
        
        <p className="mt-3 text-sm text-gray-500">
          We care about your data. Read our{' '}
          <Link href="/privacy" className="font-medium text-blue-600 hover:text-blue-500">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
} 