'use client';

import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useState, useRef } from 'react';

/**
 * Helper function to refresh the user session after payment
 * This ensures the subscription status is updated in the client
 */
export function useSessionRefresh() {
  const { data: session, update } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastRefreshed = useRef<number | null>(null);

  const refreshSession = async (force = false) => {
    // Prevent refreshing too frequently (once per minute max)
    const now = Date.now();
    const oneMinute = 60 * 1000;
    
    // Skip refresh if already in progress or if refreshed recently (unless forced)
    if (isRefreshing || (!force && lastRefreshed.current && now - lastRefreshed.current < oneMinute)) {
      return false;
    }
    
    try {
      setIsRefreshing(true);
      await update(); // Force session refresh
      lastRefreshed.current = now;
      return true;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  };

  const isSubscribed = (session?: Session | null) => {
    return session?.user?.subscription === 'PAID';
  };

  return {
    session,
    refreshSession,
    isRefreshing,
    isSubscribed: isSubscribed(session),
  };
} 