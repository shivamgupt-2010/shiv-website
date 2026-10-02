'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createSoftwareProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const version = formData.get('version') as string;
  const status = formData.get('status') as string;
  const downloadLink = formData.get('downloadLink') as string;
  const websiteLink = formData.get('websiteLink') as string;

  await db.softwareProduct.create({
    data: {
      name,
      description,
      version,
      status,
      downloadLink,
      websiteLink,
    },
  });

  revalidatePath('/admin/software');
}

export async function updateSoftwareStatus(id: string, status: string) {
  await db.softwareProduct.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/admin/software');
}

export async function deleteSoftwareProduct(id: string) {
  await db.softwareProduct.delete({
    where: { id },
  });

  revalidatePath('/admin/software');
}

export async function updateSoftwareProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const version = formData.get('version') as string;
  const status = formData.get('status') as string;
  const downloadLink = formData.get('downloadLink') as string;
  const websiteLink = formData.get('websiteLink') as string;

  await db.softwareProduct.update({
    where: { id },
    data: {
      name,
      description,
      version,
      status,
      downloadLink,
      websiteLink,
    },
  });

  revalidatePath('/admin/software');
}
