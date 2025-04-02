'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, useEffect, useState } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

// Add a custom refresh control
export default function Providers({ children }: ProvidersProps) {
  // Set a global flag to track initial load
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Mark the provider as loaded after initial render
    if (!loaded) {
      setLoaded(true);
    }
  }, [loaded]);

  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
} 