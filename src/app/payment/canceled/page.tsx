'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { XCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

export default function PaymentCanceledPage() {
  const router = useRouter();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push('/pricing');
    }, 5000);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-amber-50">
      <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-xl border border-rose-100">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-24 h-24 mb-4">
              <Image 
                src="https://illustrations.popsy.co/amber/canceled.svg" 
                alt="Canceled illustration"
                fill
                className="object-contain"
              />
            </div>
            <XCircleIcon className="h-16 w-16 text-rose-500 mb-4 absolute opacity-20" />
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-600">
              Payment Canceled
            </h2>
            <p className="mt-4 text-sm text-gray-600">
              Your payment process was canceled. No charges were made.
            </p>
            <div className="mt-3 p-3 bg-rose-50 rounded-lg border border-rose-100">
              <p className="text-xs text-rose-700">
                Want to try again? Check out our flexible pricing options.
              </p>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              You will be redirected to the pricing page in a few seconds.
            </p>
          </div>
          
          <div className="mt-6 flex justify-center space-x-4">
            <Link
              href="/pricing"
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-200"
            >
              Return to Pricing
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-xl shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all duration-200"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}