'use client';

import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useState, useRef } from 'react';

// Global state to prevent excessive refreshing across all components
const globalState = {
  lastRefreshed: 0,
  isRefreshing: false
};

/**
 * Helper function to refresh the user session after payment
 * This ensures the subscription status is updated in the client
 */
export function useSessionRefresh() {
  const { data: session, update } = useSession();
  const [localRefreshing, setLocalRefreshing] = useState(false);

  const refreshSession = async (force = false) => {
    // Prevent refreshing too frequently (2 minutes max)
    const now = Date.now();
    const twoMinutes = 2 * 60 * 1000;
    
    // Check global state to prevent multiple components from refreshing simultaneously
    if (globalState.isRefreshing || (!force && now - globalState.lastRefreshed < twoMinutes)) {
      return false;
    }
    
    try {
      // Update global and local state
      globalState.isRefreshing = true;
      setLocalRefreshing(true);
      
      // Perform the refresh
      await update(); 
      
      // Update time tracker
      globalState.lastRefreshed = now;
      return true;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return false;
    } finally {
      // Reset state
      globalState.isRefreshing = false;
      setLocalRefreshing(false);
    }
  };

  const isSubscribed = (session?: Session | null) => {
    return session?.user?.subscription === 'PAID';
  };

  return {
    session,
    refreshSession,
    isRefreshing: localRefreshing || globalState.isRefreshing,
    isSubscribed: isSubscribed(session),
  };
} 