import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/siteUrl';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getSiteUrl();
  return {
    title: 'Shivam Gupta — Founder & CEO of SHIV',
    description: 'Official profile of Shivam Gupta, Founder and CEO of SHIV.',
    alternates: {
      canonical: `${baseUrl}/ceo`,
    },
  };
}

export default function ShivamGuptaPage() {
  redirect('/ceo');
}
