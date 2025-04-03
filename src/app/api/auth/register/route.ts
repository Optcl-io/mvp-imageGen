import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db/prisma';
import { Subscription } from '@/lib/db/types';
import { z } from 'zod';
import { generateOTP, sendOtpEmail } from '@/lib/email/email-service';

// Define validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  // We'll ignore this field - all users start as FREE regardless of what is sent
  subscription: z.enum(['FREE', 'PAID']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request data
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP for email verification
    const otp = generateOTP();
    
    // Set expiry time (10 minutes from now)
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

    // Create user - always start with FREE subscription
    // Subscription upgrades should only happen through Stripe payment process
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        subscription: Subscription.FREE, // Always start as FREE
        otpCode: otp,
        otpExpiry: otpExpiry,
        // emailVerified will be set to null initially
      },
    });

    // Send verification email
    await sendOtpEmail({
      email,
      otp,
      name,
    });

    // Remove password from response
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        user: userWithoutPassword, 
        message: 'Registration successful. Please check your email to verify your account.',
        requiresVerification: true
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during registration' },
      { status: 500 }
    );
  }
} 