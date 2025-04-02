'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useSessionRefresh } from '@/lib/stripe/session-helpers';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { session, refreshSession, isSubscribed, isRefreshing } = useSessionRefresh();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isVerifying, setIsVerifying] = useState(true);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    // Update the session to reflect the new subscription status
    const verifySubscription = async () => {
      if (session && !isRefreshing) {
        // Try to refresh the session with force=true to bypass the refresh rate limit
        const success = await refreshSession(true);
        
        if (success && isSubscribed) {
          setIsVerifying(false);
          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push('/dashboard');
          }, 3000);
        } else if (attempts < 5) {
          // Try again in 2 seconds, up to 5 times (10 seconds total)
          setTimeout(() => {
            setAttempts(prev => prev + 1);
          }, 2000);
        } else {
          // Give up after 5 attempts and just show success
          setIsVerifying(false);
        }
      }
    };

    verifySubscription();
  }, [session, refreshSession, isSubscribed, router, attempts, isRefreshing]);

  // If no session ID is provided, redirect immediately
  useEffect(() => {
    if (!sessionId) {
      router.push('/dashboard');
    }
  }, [sessionId, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-xl shadow-md">
        <div className="flex flex-col items-center text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
          
          {isVerifying ? (
            <div className="mt-2 text-sm text-gray-600">
              <p>Processing your subscription...</p>
              <p className="text-xs text-gray-500 mt-1">
                This may take a few moments. Please wait...
              </p>
              <div className="mt-3 flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-600">
              Thank you for subscribing to our premium plan. Your account has been upgraded.
            </p>
          )}
          
          <p className="mt-3 text-xs text-gray-500">
            You will be redirected to the dashboard in a few seconds.
          </p>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 