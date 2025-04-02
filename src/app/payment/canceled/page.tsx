'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { XCircleIcon } from '@heroicons/react/24/outline';

export default function PaymentCanceledPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to pricing after 5 seconds
    const redirectTimer = setTimeout(() => {
      router.push('/pricing');
    }, 5000);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-md">
        <div className="flex flex-col items-center text-center">
          <XCircleIcon className="h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Payment Canceled</h2>
          <p className="mt-2 text-sm text-gray-600">
            Your payment process was canceled. No charges were made.
          </p>
          <p className="mt-1 text-xs text-gray-500">
            You will be redirected to the pricing page in a few seconds.
          </p>
        </div>
        
        <div className="mt-6 flex justify-center space-x-4">
          <Link
            href="/pricing"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Pricing
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 