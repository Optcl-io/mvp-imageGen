import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { createCheckoutSession, PREMIUM_SUBSCRIPTION_PRICE_ID } from '@/lib/stripe/stripe-client';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the price ID from the request or use the default premium price
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