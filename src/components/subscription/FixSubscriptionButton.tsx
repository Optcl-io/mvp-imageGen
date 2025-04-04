'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function FixSubscriptionButton() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  const checkStatus = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/payment/subscription-status');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to check subscription status');
      }
      
      setResult({
        success: true,
        message: `Current status: DB=${data.user.subscription}, Session=${data.sessionSubscription}, Stripe=${data.stripeSubscription?.status || 'No Stripe subscription'}`
      });
    } catch (error) {
      setResult({ error: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  const fixSubscription = async () => {
    setIsLoading(true);
    setResult(null);
    
    try {
      // Force update subscription
      const response = await fetch('/api/payment/subscription-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Optional subscription ID if you know it
          stripeSubscriptionId: null,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update subscription');
      }
      
      // Refresh the session after update
      await update();
      
      setResult({
        success: true,
        message: 'Subscription successfully updated to PAID!'
      });
    } catch (error) {
      setResult({ error: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="mb-4 text-lg font-medium">Subscription Status</h3>
      
      {result && (
        <div className={`p-3 mb-4 rounded ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {result.message || result.error}
        </div>
      )}
      
      <div className="flex flex-col space-y-2">
        <button
          onClick={checkStatus}
          disabled={isLoading}
          className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Check Status'}
        </button>
        
        <button
          onClick={fixSubscription}
          disabled={isLoading}
          className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Force Update to PAID'}
        </button>
      </div>
    </div>
  );
} 