import React from 'react';
import { Html, Body, Container, Text, Button, Head, Hr, Preview, Section, Heading, Link } from '@react-email/components';

interface SubscribeEmailProps {
  email: string;
}

export default function SubscribeEmail({ email }: SubscribeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for subscribing to the OPTCL newsletter</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Welcome to Our Newsletter!</Heading>
          <Section>
            <Text style={styles.text}>
              Thank you for subscribing to the OPTCL newsletter with your email: {email}
            </Text>
            <Text style={styles.text}>
              You'll now receive updates about our latest products, features, and news.
            </Text>
            <Section style={styles.buttonContainer}>
              <Button style={styles.button} href="https://optcl.com">
                Visit Our Website
              </Button>
            </Section>
            <Text style={styles.text}>
              If you have any questions or feedback, feel free to contact our support team.
            </Text>
            <Hr style={styles.hr} />
            <Text style={styles.footer}>
              &copy; {new Date().getFullYear()} OPTCL. All rights reserved.
            </Text>
            <Text style={styles.unsubscribe}>
              If you no longer wish to receive these emails, you can {' '}
              <Link style={styles.link} href="https://optcl.com/unsubscribe?email={{email}}">
                unsubscribe here
              </Link>.
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
    fontSize: '24px',
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
  hr: {
    borderColor: '#e6ebf1',
    margin: '20px 0',
  },
  footer: {
    fontSize: '12px',
    color: '#8898aa',
    textAlign: 'center' as const,
    margin: '20px 0',
  },
  unsubscribe: {
    fontSize: '12px',
    color: '#8898aa',
    textAlign: 'center' as const,
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'underline',
  }
}; 