'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Validates that the current user has access to Showcase (Marketer or Super Admin).
 */
async function verifyMarketerOrSuperAdmin() {
  const session = await getServerSession(authOptions);
  const userEmail = (session?.user?.email || '').toLowerCase().trim();
  const userRole = ((session?.user as any)?.role || '').toUpperCase();

  const isAuthorized = userEmail === 'admin@shiv.com' || userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' || userRole === 'MARKETER';

  if (!isAuthorized) {
    throw new Error('Unauthorized: Showcase management is restricted to Marketers and Super Admins.');
  }

  return session;
}

export async function createShowcaseItem(formData: FormData) {
  await verifyMarketerOrSuperAdmin();

  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const type = ((formData.get('type') as string)?.trim().toUpperCase() || 'PHOTO') as 'REEL' | 'PHOTO' | 'VIDEO';
  const mediaUrl = (formData.get('mediaUrl') as string)?.trim();
  const thumbnailUrl = (formData.get('thumbnailUrl') as string)?.trim() || null;
  const aspectRatio = (formData.get('aspectRatio') as string)?.trim() || (type === 'REEL' ? '9:16' : '1:1');
  const category = (formData.get('category') as string)?.trim() || 'Clothes';
  const tags = (formData.get('tags') as string)?.trim() || null;
  const productLink = (formData.get('productLink') as string)?.trim() || null;
  const featured = formData.get('featured') === 'true' || formData.get('featured') === 'on';

  if (!title || !mediaUrl) {
    throw new Error('Title and media URL are required.');
  }

  await db.showcaseItem.create({
    data: {
      title,
      description,
      type,
      mediaUrl,
      thumbnailUrl,
      aspectRatio,
      category,
      tags,
      productLink,
      featured,
      active: true,
    },
  });

  revalidatePath('/admin/showcase');
  revalidatePath('/showcase');
  revalidatePath('/gallery');
}

export async function deleteShowcaseItem(id: string) {
  await verifyMarketerOrSuperAdmin();

  await db.showcaseItem.delete({
    where: { id },
  });

  revalidatePath('/admin/showcase');
  revalidatePath('/showcase');
  revalidatePath('/gallery');
}

export async function toggleFeaturedShowcase(id: string, featured: boolean) {
  await verifyMarketerOrSuperAdmin();

  await db.showcaseItem.update({
    where: { id },
    data: { featured },
  });

  revalidatePath('/admin/showcase');
  revalidatePath('/showcase');
  revalidatePath('/gallery');
}
