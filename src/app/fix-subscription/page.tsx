'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import FixSubscriptionButton from '@/components/subscription/FixSubscriptionButton';

export default function FixSubscriptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/fix-subscription');
    }
  }, [status, router]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Already subscribed - no need to fix
  if (session?.user?.subscription === 'PAID') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Subscription Status</h1>
          <div className="bg-green-50 border border-green-100 rounded-lg p-6 mb-8">
            <p className="text-xl font-semibold text-green-700 mb-2">
              Your subscription is active!
            </p>
            <p className="text-gray-600">
              You already have a premium subscription. You don't need to fix anything.
            </p>
          </div>
          <Link href="/dashboard" className="text-white bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Fix Subscription Issues</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          If you've already paid for a subscription but your account still shows as Free,
          you can use the tools below to diagnose and fix the issue.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Current Status</h2>
        <div className="p-4 bg-gray-50 rounded-lg mb-6">
          <p className="font-medium">
            User: {session?.user?.email}
          </p>
          <p className="text-gray-600">
            Current plan: <span className="font-medium text-yellow-600">Free</span>
          </p>
        </div>

        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Subscription Repair Tool</h3>
            <p className="text-gray-600 mb-4">
              This tool will attempt to fix your subscription status by contacting our payment provider and updating your account.
            </p>
            <FixSubscriptionButton />
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Still Having Issues?</h3>
            <p className="text-gray-600 mb-4">
              If the automatic fix doesn't work, please contact our support team with your order details.
            </p>
            <a 
              href="mailto:support@example.com?subject=Subscription%20Issue"
              className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 font-medium">
          ← Return to Dashboard
        </Link>
      </div>
    </div>
  );
} 