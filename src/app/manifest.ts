import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'SHIV Store | Official Store & Products',
    short_name: 'SHIV Store',
    description: 'Official SHIV Store - Premium lifestyle apparel, limited drops, developer software, and digital solutions.',
    start_url: '/',
    display: 'standalone',
    background_color: '#07090e',
    theme_color: '#07090e',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
