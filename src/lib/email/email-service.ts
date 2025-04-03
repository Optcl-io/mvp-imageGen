import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import OtpEmail from './templates/otp-email';
import ResetPasswordEmail from './templates/reset-password-email';
import ContactEmail from './templates/contact-email';
import SubscribeEmail from './templates/subscribe-email';

// Create a transporter using Hostinger SMTP credentials
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT) || 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// Email service functions
export async function sendOtpEmail({ email, otp, name }: { email: string; otp: string; name?: string }) {
  try {
    const html = await render(OtpEmail({ otp, name: name || 'User' }));
    
    const options = {
      from: `"OPTCL" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Your One-Time Password',
      html,
    };
    
    const info = await transporter.sendMail(options);
    console.log('OTP email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail({ 
  email, 
  resetToken, 
  name 
}: { 
  email: string; 
  resetToken: string; 
  name?: string;
}) {
  try {
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;
    const html = await render(ResetPasswordEmail({ resetUrl, name: name || 'User' }));
    
    const options = {
      from: `"OPTCL" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Reset Your Password',
      html,
    };
    
    const info = await transporter.sendMail(options);
    console.log('Password reset email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return { success: false, error };
  }
}

export async function sendContactEmail({ 
  name, 
  email, 
  subject, 
  message 
}: { 
  name: string; 
  email: string; 
  subject: string; 
  message: string;
}) {
  try {
    const html = await render(ContactEmail({ name, email, subject, message }));
    
    const options = {
      from: `"OPTCL Contact Form" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_SERVER_USER, // Send to the site owner
      replyTo: email, // Allow replying directly to the person who submitted the form
      subject: `New Contact Form Submission: ${subject}`,
      html,
    };
    
    const info = await transporter.sendMail(options);
    console.log('Contact form email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send contact form email:', error);
    return { success: false, error };
  }
}

export async function sendSubscriptionConfirmationEmail({ 
  email 
}: { 
  email: string;
}) {
  try {
    const html = await render(SubscribeEmail({ email }));
    
    const options = {
      from: `"OPTCL Newsletter" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Welcome to the OPTCL Newsletter',
      html,
    };
    
    const info = await transporter.sendMail(options);
    console.log('Subscription confirmation email sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send subscription confirmation email:', error);
    return { success: false, error };
  }
}

// Function to generate a random 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to generate a reset token
export function generateResetToken(): string {
  return crypto.randomUUID();
} 