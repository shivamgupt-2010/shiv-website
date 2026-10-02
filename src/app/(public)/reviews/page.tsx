import db from '@/lib/db';
import ReviewsClient from './ReviewsClient';

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
