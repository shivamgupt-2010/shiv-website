import db from "@/lib/db";
import AdminReviewsClient from "./AdminReviewsClient";

export default async function AdminReviewsPage() {
  const reviews = await db.review.findMany({
    orderBy: { id: 'desc' }
  });

  return <AdminReviewsClient initialReviews={reviews} />;
}
