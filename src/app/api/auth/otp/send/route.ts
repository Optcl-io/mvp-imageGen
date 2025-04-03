import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';
import { generateOTP, sendOtpEmail } from '@/lib/email/email-service';

// Define validation schema
const sendOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request data
    const validationResult = sendOtpSchema.safeParse(body);
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
      // Don't reveal whether a user exists or not
      return NextResponse.json(
        { success: true, message: 'If this email exists, an OTP has been sent' },
        { status: 200 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    
    // Set expiry time (10 minutes from now)
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

    // Save OTP to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: otp,
        otpExpiry,
      },
    });

    // Send OTP email
    await sendOtpEmail({
      email: user.email,
      otp,
      name: user.name || undefined,
    });

    return NextResponse.json(
      { success: true, message: 'OTP sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while sending OTP' },
      { status: 500 }
    );
  }
} 