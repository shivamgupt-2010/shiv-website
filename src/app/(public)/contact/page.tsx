import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact & Custom Inquiries | SHIV Store',
  description: 'Get in touch with SHIV Store. Inquire about custom software, bespoke design solutions, orders, and collaborations.',
  keywords: ['Contact SHIV', 'SHIV store support', 'SHIV custom software', 'SHIV order inquiry'],
};

export default function ContactPage() {
  return <ContactClient />;
}
