import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/stripe-client';
import { prisma } from '@/lib/db/prisma';
import { Subscription } from '@/lib/db/types';

// Handling Stripe webhook events
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    // Use the raw headers from the request instead
    const signature = req.headers.get('stripe-signature');

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Missing signature or webhook secret');
      return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log(`Webhook received: ${event.type}`);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Session completed:', session.id);
        
        // Extract customer information
        const userId = session.client_reference_id;
        const subscriptionId = session.subscription;
        
        if (!userId) {
          console.error('No userId found in session:', session.id);
          return NextResponse.json({ error: 'No userId in session' }, { status: 400 });
        }

        // Verify this is a legitimate Stripe checkout (payment was actually made)
        if (session.payment_status !== 'paid' && session.status !== 'complete') {
          console.error(`Payment not completed for session ${session.id}`);
          return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
        }

        console.log(`Processing checkout for user ${userId}, subscription ${subscriptionId}`);
        
        if (userId && subscriptionId) {
          try {
            // Retrieve the subscription to get its status
            const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
            console.log(`Subscription status: ${subscription.status}`);
            
            // Only update to PAID if subscription is active and payment was processed
            const validStatus = ['active', 'trialing'].includes(subscription.status);
            
            // Update user's subscription status in the database
            await prisma.user.update({
              where: { id: userId },
              data: {
                subscription: validStatus ? Subscription.PAID : Subscription.FREE,
                stripeSubscriptionId: subscriptionId as string,
              },
            });
            
            console.log(`User ${userId} subscription updated based on checkout to ${validStatus ? 'PAID' : 'FREE'}`);
          } catch (error) {
            console.error('Error retrieving subscription:', error);
          }
        } else if (userId && session.mode === 'payment') {
          // One-time payment (if implemented)
          // Only update if payment was successful
          if (session.payment_status === 'paid') {
            await prisma.user.update({
              where: { id: userId },
              data: {
                subscription: Subscription.PAID,
              },
            });
            console.log(`User ${userId} upgraded to paid via one-time payment`);
          } else {
            console.error(`Payment not completed for one-time payment session ${session.id}`);
          }
        }
        break;
      }
      
      case 'invoice.payment_succeeded': {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const invoice = event.data.object as any; // Cast to any to access properties
        const subscriptionId = invoice.subscription;
        const customerId = invoice.customer;
        
        console.log(`Invoice paid for subscription ${subscriptionId}`);
        
        if (subscriptionId && customerId) {
          try {
            // Find user by Stripe customerId or via subscription metadata
            const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
            const userId = subscription.metadata?.userId;
            
            if (userId) {
              await prisma.user.update({
                where: { id: userId },
                data: {
                  subscription: Subscription.PAID,
                  stripeSubscriptionId: subscriptionId as string,
                },
              });
              console.log(`User ${userId} subscription updated to PAID after invoice payment`);
            } else {
              console.error('No userId found in subscription metadata');
            }
          } catch (error) {
            console.error('Error processing invoice payment:', error);
          }
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        const subscriptionStatus = subscription.status;
        
        console.log(`Subscription ${subscription.id} updated to ${subscriptionStatus}`);
        
        if (userId) {
          // If subscription is active, set user to PAID, otherwise FREE
          const userSubscriptionStatus = subscriptionStatus === 'active' ? Subscription.PAID : Subscription.FREE;
          
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscription: userSubscriptionStatus,
              stripeSubscriptionId: subscription.id,
            },
          });
          
          console.log(`User ${userId} subscription updated to ${userSubscriptionStatus}`);
        } else {
          console.error('No userId found in subscription metadata:', subscription.id);
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        
        console.log(`Subscription ${subscription.id} deleted`);
        
        if (userId) {
          // Set user back to FREE tier
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscription: Subscription.FREE,
              stripeSubscriptionId: null,
            },
          });
          
          console.log(`User ${userId} downgraded to free subscription`);
        } else {
          console.error('No userId found in deleted subscription metadata');
        }
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
} 