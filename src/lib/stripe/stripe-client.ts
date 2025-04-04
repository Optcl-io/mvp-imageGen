import Stripe from 'stripe';

// Ensure the API keys exist
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in .env file');
}

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-03-31.basil' as Stripe.LatestApiVersion,
});

// Price IDs for different subscription tiers
export const PREMIUM_SUBSCRIPTION_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID;

// Function to format price for display
export function formatStripePrice(amount: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  
  return formatter.format(amount / 100);
}

// Function to create a checkout session
export async function createCheckoutSession({
  priceId,
  userId,
  customerEmail,
}: {
  priceId: string;
  userId: string;
  customerEmail: string;
}) {
  if (!priceId) {
    throw new Error('Price ID is required');
  }

  // Get the base URL from environment
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer_email: customerEmail,
    client_reference_id: userId,
    success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/payment/canceled`,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
      // Add automatic transfer of customer ID to the subscription
      transfer_data: {
        destination: userId,
      },
    },
  });

  return checkoutSession;
}

// Function to handle successful subscription update
export async function handleSubscriptionUpdated({
  /* eslint-disable @typescript-eslint/no-unused-vars */
  userId,
  subscriptionId,
}: {
  userId: string;
  subscriptionId: string;
}) {
  try {
    // Verify the subscription status
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    if (subscription.status === 'active') {
      return {
        success: true,
        subscription,
      };
    } else {
      return {
        success: false,
        message: `Subscription status is ${subscription.status}`,
      };
    }
  } catch (error) {
    console.error('Error handling subscription update:', error);
    return {
      success: false,
      message: 'Failed to verify subscription',
    };
  }
} 