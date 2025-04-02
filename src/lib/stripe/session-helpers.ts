'use client';

import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

/**
 * Helper function to refresh the user session after payment
 * This ensures the subscription status is updated in the client
 */
export function useSessionRefresh() {
  const { data: session, update } = useSession();

  const refreshSession = async () => {
    try {
      await update(); // Force session refresh
      return true;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return false;
    }
  };

  const isSubscribed = (session?: Session | null) => {
    return session?.user?.subscription === 'PAID';
  };

  return {
    session,
    refreshSession,
    isSubscribed: isSubscribed(session),
  };
} 