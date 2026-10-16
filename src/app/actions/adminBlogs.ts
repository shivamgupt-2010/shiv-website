'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Validates that the current user has access to Blog CMS (Marketer or Super Admin).
 */
async function verifyMarketerOrSuperAdmin() {
  const session = await getServerSession(authOptions);
  const userEmail = (session?.user?.email || '').toLowerCase().trim();
  const userRole = ((session?.user as any)?.role || '').toUpperCase();

  const isAuthorized = userEmail === 'admin@shiv.com' || userRole === 'SUPER_ADMIN' || userRole === 'ADMIN' || userRole === 'MARKETER';

  if (!isAuthorized) {
    throw new Error('Unauthorized: Blog management is restricted to Marketers and Super Admins.');
  }

  return session;
}

export async function createBlogPost(formData: FormData) {
  await verifyMarketerOrSuperAdmin();

  const title = (formData.get('title') as string)?.trim();
  let slug = (formData.get('slug') as string)?.trim().toLowerCase();
  const excerpt = (formData.get('excerpt') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();
  const coverImage = (formData.get('coverImage') as string)?.trim() || null;
  const author = (formData.get('author') as string)?.trim() || 'SHIV Team';
  const category = (formData.get('category') as string)?.trim() || 'Design & Tech';
  const tags = (formData.get('tags') as string)?.trim() || null;
  const readTime = (formData.get('readTime') as string)?.trim() || '5 min read';
  const published = formData.get('published') === 'true' || formData.get('published') === 'on';

  if (!title || !excerpt || !content) {
    throw new Error('Title, excerpt, and content are required.');
  }

  if (!slug) {
    slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }

  // Ensure unique slug
  let finalSlug = slug;
  let counter = 1;
  while (await db.blogPost.findUnique({ where: { slug: finalSlug } })) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  await db.blogPost.create({
    data: {
      title,
      slug: finalSlug,
      excerpt,
      content,
      coverImage,
      author,
      category,
      tags,
      readTime,
      published,
    },
  });

  revalidatePath('/admin/blogs');
  revalidatePath('/blog');
  revalidatePath(`/blog/${finalSlug}`);
}

export async function updateBlogPost(id: string, formData: FormData) {
  await verifyMarketerOrSuperAdmin();

  const title = (formData.get('title') as string)?.trim();
  const excerpt = (formData.get('excerpt') as string)?.trim();
  const content = (formData.get('content') as string)?.trim();
  const coverImage = (formData.get('coverImage') as string)?.trim() || null;
  const author = (formData.get('author') as string)?.trim() || 'SHIV Team';
  const category = (formData.get('category') as string)?.trim() || 'Design & Tech';
  const tags = (formData.get('tags') as string)?.trim() || null;
  const readTime = (formData.get('readTime') as string)?.trim() || '5 min read';
  const published = formData.get('published') === 'true' || formData.get('published') === 'on';

  if (!title || !excerpt || !content) {
    throw new Error('Title, excerpt, and content are required.');
  }

  const updated = await db.blogPost.update({
    where: { id },
    data: {
      title,
      excerpt,
      content,
      coverImage,
      author,
      category,
      tags,
      readTime,
      published,
    },
  });

  revalidatePath('/admin/blogs');
  revalidatePath('/blog');
  revalidatePath(`/blog/${updated.slug}`);
}

export async function togglePublishBlog(id: string, published: boolean) {
  await verifyMarketerOrSuperAdmin();

  const post = await db.blogPost.update({
    where: { id },
    data: { published },
  });

  revalidatePath('/admin/blogs');
  revalidatePath('/blog');
  revalidatePath(`/blog/${post.slug}`);
}

export async function deleteBlogPost(id: string) {
  await verifyMarketerOrSuperAdmin();

  const post = await db.blogPost.delete({
    where: { id },
  });

  revalidatePath('/admin/blogs');
  revalidatePath('/blog');
  revalidatePath(`/blog/${post.slug}`);
}
