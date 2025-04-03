import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendSubscriptionConfirmationEmail } from '@/lib/email/email-service';
import { prisma } from '@/lib/db/prisma';

// Define validation schema
const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request data
    const validationResult = subscribeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Check if the email is already subscribed
    const existingSubscription = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      return NextResponse.json(
        { success: true, message: 'Email already subscribed' },
        { status: 200 }
      );
    }

    // Save the subscription to the database
    await prisma.newsletter.create({
      data: {
        email,
        subscribedAt: new Date(),
      },
    });

    // Send the subscription confirmation email
    await sendSubscriptionConfirmationEmail({ email });

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed to the newsletter' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while subscribing' },
      { status: 500 }
    );
  }
} 