import db from '@/lib/db';
import ReviewsClient from './ReviewsClient';

export default async function ReviewsPage() {
  const reviews = await db.review.findMany({
    where: { hidden: false },
    orderBy: { id: 'desc' },
  });

  return <ReviewsClient initialReviews={reviews} />;
}
