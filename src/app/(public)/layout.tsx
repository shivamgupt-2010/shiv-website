import type { Metadata } from 'next';
import { Sora, Inter, JetBrains_Mono } from 'next/font/google';
import '../globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloating from '@/components/layout/WhatsAppFloating';
import ProvidersWrapper from '@/components/ProvidersWrapper';
import { getSiteUrl } from '@/lib/siteUrl';

const sora = Sora({ 
  subsets: ['latin'], 
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-mono',
  display: 'swap',
});

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'SHIV Store | Official Store & Products — Build. Design. Evolve.',
    template: '%s | SHIV Store',
  },
  description: 'Welcome to the official SHIV Store. Discover premium lifestyle apparel, limited edition drops, high-performance developer software, and custom digital solutions from SHIV.',
  keywords: [
    'SHIV store',
    'SHIV',
    'SHIV official store',
    'SHIV clothing',
    'SHIV apparel',
    'SHIV wear',
    'SHIV online store',
    'SHIV brand',
    'SHIV products',
    'SHIV software',
    'buy SHIV',
    'SHIV India',
    'SHIV launcher',
  ],
  authors: [{ name: 'SHIV', url: baseUrl }],
  creator: 'SHIV',
  publisher: 'SHIV Store',
  applicationName: 'SHIV Store',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: baseUrl,
    siteName: 'SHIV Store',
    title: 'SHIV Store | Official Store & Products — Build. Design. Evolve.',
    description: 'Official SHIV Store - Premium apparel, limited drops, software tools, and digital solutions.',
    images: [
      {
        url: '/icon.svg',
        width: 512,
        height: 512,
        alt: 'SHIV Store Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHIV Store | Official Store & Products',
    description: 'Official SHIV Store - Premium apparel, developer tools, and digital solutions.',
    images: ['/icon.svg'],
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
  verification: {
    google: '29XGiGGVrfl2Ff3y75voxCAikcCRNu1KlOur1tK6iuM',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'OnlineStore',
      '@id': `${baseUrl}/#store`,
      name: 'SHIV Store',
      alternateName: ['SHIV', 'SHIV Official Store', 'SHIV Wear', 'SHIV Brand'],
      url: baseUrl,
      logo: `${baseUrl}/icon.svg`,
      image: `${baseUrl}/icon.svg`,
      description: 'Official SHIV Store for lifestyle apparel, limited drops, developer software, and custom digital solutions.',
      priceRange: '₹₹',
      currenciesAccepted: 'INR',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
      },
      sameAs: [
        'https://youtube.com/@shiv-techofficial?si=waKKCQ642kNOw5Hu',
        'https://www.instagram.com/shivam_gupta0310/',
      ],
      telephone: '+91-626686575',
      email: 'shivamgupta@gmail.com',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-626686575',
        contactType: 'customer support',
        email: 'shivamgupta@gmail.com',
        availableLanguage: ['English', 'Hindi'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: 'SHIV Store',
      publisher: {
        '@id': `${baseUrl}/#store`,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/products?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <meta name="google-site-verification" content="29XGiGGVrfl2Ff3y75voxCAikcCRNu1KlOur1tK6iuM" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ProvidersWrapper>
          <Navbar />
          <main style={{ minHeight: '100vh', paddingTop: '72px' }}>
            {children}
          </main>
          <Footer />
          <WhatsAppFloating />
        </ProvidersWrapper>
      </body>
    </html>
  );
}
