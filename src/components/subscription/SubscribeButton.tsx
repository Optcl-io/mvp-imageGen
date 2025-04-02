'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface SubscribeButtonProps {
  priceId?: string; // Optional custom price ID
  className?: string;
  children?: React.ReactNode;
}

export default function SubscribeButton({ 
  priceId, 
  className = '',
  children = 'Upgrade to Premium'
}: SubscribeButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!session?.user) {
      // Redirect to login if not authenticated
      router.push(`/auth/login?callbackUrl=/pricing&plan=paid`);
      return;
    }

    setIsLoading(true);

    try {
      // Call our checkout API route
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId, // Send custom price ID if provided
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to the Stripe Checkout page
      router.push(data.url);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSubscribe}
      disabled={isLoading}
      className={`rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${className}`}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
} 