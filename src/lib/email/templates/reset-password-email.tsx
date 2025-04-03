import React from 'react';
import { Html, Body, Container, Text, Button, Head, Hr, Preview, Section, Heading, Link } from '@react-email/components';

interface ResetPasswordEmailProps {
  resetUrl: string;
  name: string;
}

export default function ResetPasswordEmail({ resetUrl, name }: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your OPTCL password</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>OPTCL</Heading>
          <Section>
            <Text style={styles.text}>Hello {name},</Text>
            <Text style={styles.text}>
              We received a request to reset your password. Click the button below to set a new password. This link will expire in 1 hour.
            </Text>
            <Section style={styles.buttonContainer}>
              <Button style={styles.button} href={resetUrl}>
                Reset Password
              </Button>
            </Section>
            <Text style={styles.text}>
              If you didn't request this password reset, you can safely ignore this email.
            </Text>
            <Text style={styles.text}>
              Alternatively, you can copy and paste the following URL into your browser:
            </Text>
            <Text style={styles.linkText}>
              <Link href={resetUrl} style={styles.link}>
                {resetUrl}
              </Link>
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
  buttonContainer: {
    textAlign: 'center' as const,
    margin: '30px 0',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 24px',
  },
  linkText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
    wordBreak: 'break-all' as const,
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
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