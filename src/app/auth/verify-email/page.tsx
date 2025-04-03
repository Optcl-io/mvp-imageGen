'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = Array(6).fill(0).map(() => useState<HTMLInputElement | null>(null));

  useEffect(() => {
    // Get email from URL parameters
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
    
    // Focus the first input field on load
    const firstInput = inputRefs[0][0];
    if (firstInput) {
      firstInput.focus();
    }
  }, [searchParams]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    // Update OTP digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = inputRefs[index + 1][0];
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = inputRefs[index - 1][0];
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Check if pasted data is 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Focus the last input
      const lastInput = inputRefs[5][0];
      if (lastInput) lastInput.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otpCode,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify email');
      }
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to verify email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend OTP');
      }
      
      setError('');
      setSuccess(false); // Reset success state
      
      // Show message
      alert('OTP has been resent to your email');
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Email Verification</h1>
          {!success ? (
            <p className="text-gray-600">
              We&apos;ve sent a verification code to your email.
              {email && <span className="block mt-1 font-medium text-gray-800">{email}</span>}
            </p>
          ) : (
            <div className="text-green-600 font-medium">
              <p>Email verified successfully!</p>
              <p className="text-sm mt-2">Redirecting to login...</p>
            </div>
          )}
        </div>

        {!success && (
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Verification Code
              </label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    ref={(el) => inputRefs[index][1](el)}
                    className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>

            <div className="flex justify-between text-sm">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Resend Code
              </button>
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-800">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 