'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useSessionRefresh } from '@/lib/stripe/session-helpers';
import Image from 'next/image';

function PaymentSuccessPage2() {
  const router = useRouter();
  const { session, refreshSession, isSubscribed, isRefreshing } = useSessionRefresh();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isVerifying, setIsVerifying] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [hasAttemptedRefresh, setHasAttemptedRefresh] = useState(false);

  const verifySubscription = useCallback(async () => {
    if (!session?.user || isRefreshing) return;

    // If already subscribed, redirect to dashboard
    if (isSubscribed) {
      setIsVerifying(false);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      return;
    }

    // Only try to refresh if we haven't already tried too many times
    if (attempts < 3 && !hasAttemptedRefresh) {
      setHasAttemptedRefresh(true);

      try {
        // Force a session refresh
        await refreshSession(true);
        
        // Check subscription status again
        // Add a slight delay to allow session update to propagate
        setTimeout(async () => {
          // If subscription is now active, redirect to dashboard
          if (isSubscribed) {
            setIsVerifying(false);
            setTimeout(() => {
              router.push('/dashboard');
            }, 2000);
          } else if (attempts < 3) {
            // If still not subscribed, try again after a delay
            setAttempts(prev => prev + 1);
            setHasAttemptedRefresh(false);
            
            // Increase delay with each attempt
            setTimeout(() => {
              verifySubscription();
            }, 3000 + (attempts * 2000));
          } else {
            // Give up after 3 attempts
            setIsVerifying(false);
          }
        }, 1000);
      } catch (err) {
        console.error("Error verifying subscription:", err);
        setIsVerifying(false);
      }
    } else if (attempts >= 3) {
      // Give up after 3 attempts
      setIsVerifying(false);
    }
  }, [session, refreshSession, isSubscribed, router, attempts, isRefreshing, hasAttemptedRefresh]);

  useEffect(() => {
    if (!isVerifying || isRefreshing) return;
    verifySubscription();
  }, [verifySubscription, isVerifying, isRefreshing, attempts]);

  useEffect(() => {
    if (!sessionId) {
      router.push('/dashboard');
    }
  }, [sessionId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md p-8 space-y-8 bg-white border border-indigo-100 shadow-xl rounded-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-24 h-24 mb-4">
              <Image 
                src="https://illustrations.popsy.co/amber/success.svg" 
                alt="Success illustration"
                fill
                className="object-contain"
              />
            </div>
            <CheckCircleIcon className="absolute w-16 h-16 mb-4 text-green-500 opacity-20" />
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-600">
              Payment Successful!
            </h2>
            
            {isVerifying ? (
              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium">Processing your subscription...</p>
                <p className="mt-2 text-xs text-gray-500">
                  This may take a few moments. Please wait...
                </p>
                <div className="flex items-center justify-center mt-4">
                  <div className="w-8 h-8 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Thank you for subscribing to our premium plan. Your account has been upgraded!
                </p>
                <div className="p-3 mt-3 border border-green-100 rounded-lg bg-green-50">
                  <p className="text-xs text-green-700">
                    You now have access to all premium features. Start creating amazing content!
                  </p>
                </div>
              </div>
            )}
            
            <p className="mt-4 text-xs text-gray-500">
              You will be redirected to the dashboard in a few seconds.
            </p>
          </div>
          
          <div className="flex justify-center mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white transition-all duration-200 border border-transparent shadow-sm rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const PaymentSuccessPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessPage2 />
    </Suspense>
  );
};

export default PaymentSuccessPage;