'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createGalleryItem(formData: FormData) {
  const title = formData.get('title') as string;
  const url = formData.get('url') as string;
  const type = formData.get('type') as string;
  const active = formData.get('active') === 'on';

  if (!title || !url || !type) {
    throw new Error('Missing required fields');
  }

  await db.galleryItem.create({
    data: {
      title,
      url,
      type,
      active,
    },
  });

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
}

export async function deleteGalleryItem(id: string) {
  await db.galleryItem.delete({
    where: { id },
  });

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
}

export async function toggleGalleryItemActive(id: string, active: boolean) {
  await db.galleryItem.update({
    where: { id },
    data: { active },
  });

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
}
