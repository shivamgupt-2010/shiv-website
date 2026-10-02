'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function submitReview(formData: FormData) {
  const customerName = formData.get('customerName') as string;
  const company = formData.get('company') as string;
  const rating = parseInt(formData.get('rating') as string) || 5;
  const productProject = formData.get('productProject') as string;
  const reviewText = formData.get('review') as string;

  if (!customerName || !reviewText) {
    throw new Error('Name and review text are required');
  }

  await db.review.create({
    data: {
      customerName,
      company: company || null,
      rating,
      productProject: productProject || null,
      review: reviewText,
      // Newly submitted reviews are hidden by default for admin approval
      hidden: true,
      featured: false,
    },
  });

  revalidatePath('/reviews');
}
