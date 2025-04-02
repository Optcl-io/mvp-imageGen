import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { createCheckoutSession, PREMIUM_SUBSCRIPTION_PRICE_ID } from '@/lib/stripe/stripe-client';
import { Subscription } from '@/lib/db/types';
import { prisma } from '@/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    // Check if the user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      console.error('No authenticated user found during checkout');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the current user from the database to check subscription status
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      console.error('User not found in database during checkout');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent users who already have a PAID subscription from initiating another checkout
    if (user.subscription === Subscription.PAID) {
      console.warn(`User ${user.id} attempted to checkout while already on a PAID subscription`);
      return NextResponse.json(
        { error: 'You already have an active premium subscription' },
        { status: 400 }
      );
    }

    // Get the priceId from the request body or use default
    const { priceId = PREMIUM_SUBSCRIPTION_PRICE_ID } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid price ID' },
        { status: 400 }
      );
    }

    // Create a Stripe checkout session
    const checkoutSession = await createCheckoutSession({
      priceId,
      userId: session.user.id,
      customerEmail: session.user.email || '',
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 