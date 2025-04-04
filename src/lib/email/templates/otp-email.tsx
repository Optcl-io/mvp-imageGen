import React from 'react';
import { Html, Body, Container, Text, Head, Hr, Preview, Section, Heading } from '@react-email/components';

interface OtpEmailProps {
  otp: string;
  name: string;
}

export default function OtpEmail({ otp, name }: OtpEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your OTP code for OPTCL</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>OPTCL</Heading>
          <Section>
            <Text style={styles.text}>Hello {name},</Text>
            <Text style={styles.text}>
              Please use the following One-Time Password (OTP) to verify your account. This code will expire in 10 minutes.
            </Text>
            <Section style={styles.otpContainer}>
              <Text style={styles.otpText}>{otp}</Text>
            </Section>
            <Text style={styles.text}>
              If you didn&apos;t request this code, you can safely ignore this email.
            </Text>
            <Hr style={styles.hr} />
            <Text style={styles.footer}>
              &copy; {new Date().getFullYear()} OPTCL. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: '#f6f9fc',
    fontFamily: 'Arial, sans-serif',
  },
  container: {
    margin: '0 auto',
    padding: '20px 0',
    maxWidth: '580px',
  },
  heading: {
    fontSize: '32px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    margin: '30px 0',
    color: '#3b82f6',
  },
  text: {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#333',
    marginBottom: '16px',
  },
  otpContainer: {
    textAlign: 'center' as const,
    margin: '30px 0',
    padding: '20px',
    backgroundColor: '#f0f7ff',
    borderRadius: '8px',
    border: '1px solid #cce5ff',
  },
  otpText: {
    fontSize: '36px',
    fontWeight: 'bold',
    letterSpacing: '8px',
    color: '#3b82f6',
  },
  hr: {
    borderColor: '#e6ebf1',
    margin: '20px 0',
  },
  footer: {
    fontSize: '12px',
    color: '#8898aa',
    textAlign: 'center' as const,
  },
}; 