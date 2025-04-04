'use client';

import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

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
    // Allow immediate refresh when forced
    if (force) {
      try {
        setLocalRefreshing(true);
        globalState.isRefreshing = true;
        
        // Perform the refresh
        await update();
        
        // Update time tracker
        globalState.lastRefreshed = Date.now();
        return true;
      } catch (error) {
        console.error('Error refreshing session:', error);
        return false;
      } finally {
        // Reset state
        globalState.isRefreshing = false;
        setLocalRefreshing(false);
      }
    }
    
    // Standard refresh with rate limiting
    const now = Date.now();
    const oneMinute = 60 * 1000; // Reduce to 1 minute to ensure quicker updates
    
    // Prevent refreshing too frequently
    if (globalState.isRefreshing || (!force && now - globalState.lastRefreshed < oneMinute)) {
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