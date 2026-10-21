import type { Metadata } from 'next';
import CeoPageClient from './CeoPageClient';
import { getSiteUrl } from '@/lib/siteUrl';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getSiteUrl();
  const canonicalUrl = `${baseUrl}/ceo`;
  const primaryImageUrl = `${baseUrl}/images/ceo/shivam-gupta-ceo.jpg`;

  return {
    title: 'Shivam Gupta — Founder & CEO of SHIV | Official Profile',
    description:
      'Official executive biography, technical architecture, and creative journey of Shivam Gupta, Founder and CEO of SHIV. Architecting SHIV AI, SHIV Launcher, and the SHIV digital ecosystem.',
    keywords: [
      'Shivam Gupta',
      'Shivam Gupta CEO',
      'CEO of SHIV',
      'Founder of SHIV',
      'Shivam Gupta SHIV',
      'Shivam Gupta Burhar',
      'Shivam Gupta tech entrepreneur',
      '@shivam13gupta',
      '@shivam_gupta0310',
      'Musicshiv',
      'SHIV AI founder',
      'SHIV Launcher architect',
      'SHIV Identity @shivam',
      'SHIV CEO official profile',
    ],
    authors: [{ name: 'Shivam Gupta', url: canonicalUrl }],
    creator: 'Shivam Gupta',
    publisher: 'SHIV Technologies',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: 'Shivam Gupta — Founder & CEO of SHIV',
      description:
        'Official executive profile of Shivam Gupta, Founder and CEO of SHIV. Explore his work across AI systems, software architecture, and the SHIV ecosystem.',
      url: canonicalUrl,
      siteName: 'SHIV',
      images: [
        {
          url: primaryImageUrl,
          width: 1200,
          height: 630,
          alt: 'Shivam Gupta — Founder & CEO of SHIV',
        },
      ],
      type: 'profile',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Shivam Gupta — Founder & CEO of SHIV',
      description:
        'Official executive profile of Shivam Gupta, Founder & CEO of SHIV. Technologist, software architect, and creator.',
      images: [primaryImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function CeoPage() {
  const baseUrl = getSiteUrl();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${baseUrl}/ceo#person`,
        name: 'Shivam Gupta',
        alternateName: ['Shivam', 'Musicshiv', 'CEO of SHIV', 'Shivam Gupta SHIV'],
        jobTitle: 'Founder & Chief Executive Officer',
        worksFor: {
          '@type': 'Organization',
          '@id': `${baseUrl}/#organization`,
          name: 'SHIV',
          url: baseUrl,
          logo: `${baseUrl}/icon.svg`,
          sameAs: [
            'https://www.youtube.com/@shivam13gupta',
            'https://www.instagram.com/shivam_gupta0310',
          ],
        },
        url: `${baseUrl}/ceo`,
        image: {
          '@type': 'ImageObject',
          url: `${baseUrl}/images/ceo/shivam-gupta-ceo.jpg`,
          caption: 'Shivam Gupta — Founder & CEO of SHIV',
        },
        description:
          'Shivam Gupta is the Founder and Chief Executive Officer of SHIV. He leads technical architecture, autonomous AI agents, operating system tools, and consumer digital products.',
        sameAs: [
          'https://www.youtube.com/@shivam13gupta',
          'https://www.instagram.com/shivam_gupta0310',
          `${baseUrl}/ceo`,
        ],
        knowsAbout: [
          'Artificial Intelligence',
          'Software Architecture',
          'Next.js Full-Stack Engineering',
          'Android & Operating Systems Development',
          'Music Production & Songwriting',
          'Digital Business Automation',
        ],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Burhar',
          addressRegion: 'Madhya Pradesh',
          addressCountry: 'India',
        },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${baseUrl}/ceo#webpage`,
        url: `${baseUrl}/ceo`,
        name: 'Shivam Gupta — Founder & CEO of SHIV | Official Profile',
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          name: 'SHIV',
          url: baseUrl,
        },
        mainEntity: {
          '@id': `${baseUrl}/ceo#person`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CeoPageClient />
    </>
  );
}
