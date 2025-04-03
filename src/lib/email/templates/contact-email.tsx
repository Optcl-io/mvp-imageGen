import React from 'react';
import { Html, Body, Container, Text, Head, Hr, Preview, Section, Heading } from '@react-email/components';

interface ContactEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactEmail({ name, email, subject, message }: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission: {subject}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>New Contact Message</Heading>
          <Section>
            <Text style={styles.text}>
              <strong>From:</strong> {name} ({email})
            </Text>
            <Text style={styles.text}>
              <strong>Subject:</strong> {subject}
            </Text>
            <Hr style={styles.hr} />
            <Text style={styles.text}>
              <strong>Message:</strong>
            </Text>
            <Text style={styles.message}>{message}</Text>
            <Hr style={styles.hr} />
            <Text style={styles.footer}>
              This email was sent from the contact form on your OPTCL website.
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
  message: {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#333',
    marginBottom: '16px',
    padding: '15px',
    backgroundColor: '#f5f7f9',
    borderRadius: '5px',
    whiteSpace: 'pre-wrap' as const,
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