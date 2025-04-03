import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';
import { generateResetToken, sendPasswordResetEmail } from '@/lib/email/email-service';

// Define validation schema
const requestResetSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request data
    const validationResult = requestResetSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return 200 even if user doesn't exist for security reasons
      return NextResponse.json(
        { success: true, message: 'If this email exists, a password reset link has been sent' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = generateResetToken();
    
    // Set expiry time (1 hour from now)
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send password reset email
    await sendPasswordResetEmail({
      email: user.email,
      resetToken,
      name: user.name || undefined,
    });

    return NextResponse.json(
      { success: true, message: 'Password reset email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while requesting password reset' },
      { status: 500 }
    );
  }
} 