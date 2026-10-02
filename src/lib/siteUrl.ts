/**
 * Robust site URL resolver that safely handles protocols.
 * Supports:
 * - Full URLs: 'https://shivstore.vercel.app'
 * - Bare hostnames provided by Vercel env: 'shivstore.vercel.app'
 * - Local development: 'http://localhost:3000'
 */
export function getSiteUrl(): string {
  let url = process.env.NEXTAUTH_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'https://shivstore.vercel.app';
  url = url.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url.replace(/\/+$/, '');
}
