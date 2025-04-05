'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';

// Create a client component that uses useSearchParams
function PaymentSuccessContent() {
  const router = useRouter();
  const { data: session, update, status } = useSession();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isProcessing, setIsProcessing] = useState(true);
  const [message, setMessage] = useState('Verifying your subscription...');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [completed, setCompleted] = useState(false);

  const forceUpdateSubscription = useCallback(async () => {
    try {
      const response = await fetch('/api/payment/subscription-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update subscription status');
      }
      
      // Force refresh session after DB update
      await update();
      return true;
    } catch (err) {
      console.error('Error forcing subscription update:', err);
      return false;
    }
  }, [update]);

  const refreshSession = useCallback(async () => {
    if (status !== 'authenticated') return false;
    
    try {
      await update();
      return true;
    } catch (err) {
      console.error('Error refreshing session:', err);
      return false;
    }
  }, [update, status]);

  // Helper to properly complete the verification process
  const completeVerification = useCallback((success: boolean, errorMessage?: string) => {
    if (completed) return; // Prevent multiple completion calls
    
    setCompleted(true);
    setIsProcessing(false);
    
    if (success) {
      setMessage('Your subscription has been activated!');
      setError('');
    } else {
      setError(errorMessage || 'We couldn\'t verify your subscription. Please try again.');
    }
    
    // Force attempts to max to prevent further processing
    setAttempts(999);
  }, [completed]);

  // This effect handles subscription verification
  useEffect(() => {
    if (!sessionId || completed) return;
    
    const verifySubscription = async () => {
      // Prevent multiple verification attempts if already successful
      if (!isProcessing || completed) return;
      
      // On first attempt, always try the direct force update
      if (attempts === 0) {
        setMessage('Activating your subscription...');
        // Try to force an update immediately
        const success = await forceUpdateSubscription();
        
        // If already completed, don't continue
        if (completed) return;
        
        if (success) {
          // Wait a moment then refresh the session
          await new Promise(resolve => setTimeout(resolve, 1000));
          await refreshSession();
          
          // Complete the process
          completeVerification(true);
          return;
        }
      }
      
      // Regular verification logic for subsequent attempts
      setMessage(`Verifying your payment (attempt ${attempts + 1})...`);
      
      // First attempt a regular session refresh
      if (await refreshSession()) {
        if (session?.user?.subscription === 'PAID') {
          completeVerification(true);
          return;
        }
      }
      
      // If session refresh didn't work, try force update
      setMessage('Updating your subscription...');
      if (await forceUpdateSubscription()) {
        await refreshSession();
        completeVerification(true);
        return;
      }
      
      // Only increment counter if not already successful
      if (attempts < 4 && isProcessing && !completed) {
        setAttempts(prev => prev + 1);
      } else {
        completeVerification(false, 'We couldn\'t automatically verify your subscription. Please try the "Fix My Subscription" button, or contact support if the issue persists.');
      }
    };

    // Only start verification if processing
    if (isProcessing) {
      // Run verification with increasing delays between attempts
      // Shorter delay for first attempt
      const delay = [500, 2000, 3000, 5000, 8000][attempts];
      const timer = setTimeout(verifySubscription, delay);
      return () => clearTimeout(timer);
    }
  }, [sessionId, attempts, session, refreshSession, forceUpdateSubscription, isProcessing, completed]);

  // Redirect if no session ID
  useEffect(() => {
    if (!sessionId) {
      router.push('/dashboard');
    }
  }, [sessionId, router]);

  const handleManualFix = async () => {
    if (completed) return;
    
    setIsProcessing(true);
    setMessage('Applying manual fix...');
    setError('');
    
    try {
      const success = await forceUpdateSubscription();
      
      if (success) {
        // Final refresh to confirm
        await refreshSession();
        completeVerification(true);
      } else {
        completeVerification(false, 'Failed to manually activate your subscription. Please contact support.');
      }
    } catch (err) {
      console.error('Error in manual fix:', err);
      completeVerification(false, 'An unexpected error occurred. Please contact support.');
    }
  };

  // Update the hook with proper dependency
  useEffect(() => {
    if (searchParams.get('session_id')) {
      completeVerification();
    }
  }, [searchParams, completeVerification]);  // Include completeVerification as a dependency

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 mx-auto bg-white rounded-xl shadow-lg">
        <div className="text-center">
          {isProcessing ? (
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-t-indigo-600 border-gray-200 rounded-full animate-spin"></div>
          ) : error ? (
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          ) : (
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
              <CheckCircleIcon className="w-8 h-8 text-green-600" />
            </div>
          )}

          <h1 className="mb-4 text-2xl font-bold text-gray-900">Payment Successful</h1>
          
          <p className="mb-6 text-gray-600">
            {error || message}
          </p>
          
          {error && (
            <button
              onClick={handleManualFix}
              className="block w-full px-5 py-3 mb-4 font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Fix My Subscription
            </button>
          )}

          <Link
            href="/dashboard"
            className={`block w-full px-5 py-3 font-medium text-center rounded-lg ${
              error ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

// Wrap in Suspense boundary to fix the build error
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-t-indigo-600 border-gray-200 rounded-full animate-spin"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}