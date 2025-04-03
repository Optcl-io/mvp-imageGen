import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendContactEmail } from '@/lib/email/email-service';

// Define validation schema
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request data
    const validationResult = contactFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validationResult.data;

    // Send the contact form email
    const result = await sendContactEmail({
      name,
      email,
      subject,
      message,
    });

    if (!result.success) {
      throw new Error('Failed to send email');
    }

    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending contact form:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while sending your message' },
      { status: 500 }
    );
  }
} 