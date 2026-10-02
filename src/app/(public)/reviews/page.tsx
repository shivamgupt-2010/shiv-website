import type { Metadata } from 'next';
import db from '@/lib/db';
import ReviewsClient from './ReviewsClient';

export const metadata: Metadata = {
  title: 'Customer Reviews & Testimonials | SHIV Store',
  description: 'Read authentic verified customer reviews and ratings for SHIV products, developer gear, and software services.',
  keywords: ['SHIV reviews', 'SHIV store customer reviews', 'SHIV testimonials', 'SHIV product ratings'],
};

export default async function ReviewsPage() {
  let reviews: any[] = [];
  try {
    reviews = await db.review.findMany({
      where: { hidden: false },
      orderBy: { id: 'desc' },
    });
  } catch (error) {
    console.error('Database connection error in Reviews page:', error);
  }

  return <ReviewsClient initialReviews={reviews} />;
}
