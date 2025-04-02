import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/stripe-client';
import { prisma } from '@/lib/db/prisma';
import { Subscription } from '@/lib/db/types';

// Handling Stripe webhook events
export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = headers();
  const signature = headersList.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Extract customer information
        const userId = session.client_reference_id;
        const subscriptionId = session.subscription;
        
        if (userId && subscriptionId) {
          // Retrieve the subscription to get its status
          const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
          
          if (subscription.status === 'active') {
            // Update user's subscription status in the database
            await prisma.user.update({
              where: { id: userId },
              data: {
                subscription: Subscription.PAID,
              },
            });
            
            console.log(`User ${userId} upgraded to paid subscription`);
          }
        }
        break;
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        
        if (userId) {
          // If subscription is active, set user to PAID, otherwise FREE
          const subscriptionStatus = subscription.status === 'active' ? Subscription.PAID : Subscription.FREE;
          
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscription: subscriptionStatus,
            },
          });
          
          console.log(`User ${userId} subscription updated to ${subscriptionStatus}`);
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata?.userId;
        
        if (userId) {
          // Set user back to FREE tier
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscription: Subscription.FREE,
            },
          });
          
          console.log(`User ${userId} downgraded to free subscription`);
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