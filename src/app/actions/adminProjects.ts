'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createProject(formData: FormData) {
  const name = formData.get('name') as string;
  const client = formData.get('client') as string;
  const category = formData.get('category') as string;
  const description = formData.get('description') as string;
  const liveUrl = formData.get('liveUrl') as string;
  const featured = formData.get('featured') === 'on';

  await db.project.create({
    data: {
      name,
      client,
      category,
      description,
      liveUrl,
      featured,
    },
  });

  revalidatePath('/admin/projects');
}

export async function toggleProjectFeatured(id: string, featured: boolean) {
  await db.project.update({
    where: { id },
    data: { featured },
  });

  revalidatePath('/admin/projects');
}

export async function deleteProject(id: string) {
  await db.project.delete({
    where: { id },
  });

  revalidatePath('/admin/projects');
}
