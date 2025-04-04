import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db/prisma';
import { stripe } from '@/lib/stripe/stripe-client';
import Stripe from 'stripe';
import { Subscription } from '@/lib/db/types';

// This route is for debugging subscription status
/* eslint-disable @typescript-eslint/no-unused-vars */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user data
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        subscription: true,
        stripeSubscriptionId: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check Stripe subscription if exists
    let stripeSubscription: Stripe.Subscription | null = null;
    if (user.stripeSubscriptionId) {
      try {
        stripeSubscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
      } catch (error) {
        console.error('Error retrieving Stripe subscription:', error);
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        subscription: user.subscription,
        stripeSubscriptionId: user.stripeSubscriptionId,
      },
      sessionSubscription: session.user.subscription,
      stripeSubscription: stripeSubscription ? {
        id: stripeSubscription.id,
        status: stripeSubscription.status,
        /* eslint-disable @typescript-eslint/no-explicit-any */
        currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000).toISOString(),
      } : null,
    });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
}

// Force update to PAID subscription - for manual fixes
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get the user data with potential subscription ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        subscription: true,
        stripeSubscriptionId: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the user already has a Stripe subscription ID
    if (user.stripeSubscriptionId) {
      try {
        // Verify subscription status with Stripe
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        
        // If subscription is active, update user to PAID
        if (subscription.status === 'active' || subscription.status === 'trialing') {
          const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { 
              subscription: Subscription.PAID 
            },
          });
          
          return NextResponse.json({
            success: true,
            message: "Subscription verified with Stripe and updated to PAID",
            user: updatedUser
          });
        }
      } catch (stripeError) {
        console.error('Error checking Stripe subscription:', stripeError);
        // Continue to fallback if Stripe check fails
      }
    }

    // Fallback: Force update to PAID even without checking Stripe
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        subscription: Subscription.PAID,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subscription manually updated to PAID",
      user: updatedUser
    });
  } catch (error) {
    console.error('Error forcing subscription update:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription status' },
      { status: 500 }
    );
  }
} 