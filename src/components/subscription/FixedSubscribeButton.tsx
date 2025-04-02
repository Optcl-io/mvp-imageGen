'use client';

import { RocketLaunchIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import SubscribeButton from './SubscribeButton';

export default function FixedSubscribeButton() {
  const { data: session } = useSession();
  
  // Only show for authenticated users who aren't on the premium plan
  if (!session?.user || session.user.subscription === 'PAID') {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-10">
      <div className="rounded-lg bg-white p-1 shadow-lg ring-1 ring-gray-900/5">
        <SubscribeButton className="group flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <RocketLaunchIcon className="h-5 w-5 text-white" aria-hidden="true" />
          <span>Upgrade to Premium</span>
        </SubscribeButton>
      </div>
    </div>
  );
} 