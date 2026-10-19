'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface SoftwareUpdatePayload {
  name: string;
  description: string;
  price?: number;
  priceFormatted?: string;
  version?: string;
  status: string;
  downloadLink?: string;
  websiteLink?: string;
  features?: string[];
}

export async function createSoftwareProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const priceRaw = formData.get('price') as string;
  const price = priceRaw !== null && priceRaw !== undefined && priceRaw !== '' ? parseFloat(priceRaw) : 0;
  const priceFormatted = (formData.get('priceFormatted') as string) || (price === 0 ? 'Free' : `₹${price.toLocaleString('en-IN')}`);
  const version = (formData.get('version') as string) || '1.0.0';
  const status = (formData.get('status') as string) || 'AVAILABLE';
  const downloadLink = formData.get('downloadLink') as string;
  const websiteLink = formData.get('websiteLink') as string;

  await db.softwareProduct.create({
    data: {
      name,
      description,
      price,
      priceFormatted,
      version,
      status,
      downloadLink,
      websiteLink,
    },
  });

  revalidatePath('/admin/software');
  revalidatePath('/software');
}

export async function updateSoftwareProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const priceRaw = formData.get('price') as string;
  const price = priceRaw !== null && priceRaw !== undefined && priceRaw !== '' ? parseFloat(priceRaw) : 0;
  const priceFormatted = (formData.get('priceFormatted') as string) || (price === 0 ? 'Free' : `₹${price.toLocaleString('en-IN')}`);
  const version = formData.get('version') as string;
  const status = formData.get('status') as string;
  const downloadLink = formData.get('downloadLink') as string;
  const websiteLink = formData.get('websiteLink') as string;

  await db.softwareProduct.update({
    where: { id },
    data: {
      name,
      description,
      price,
      priceFormatted,
      version,
      status,
      downloadLink,
      websiteLink,
    },
  });

  revalidatePath('/admin/software');
  revalidatePath('/software');
}

export async function adminSaveSoftwareJSON(id: string | null, payload: SoftwareUpdatePayload) {
  try {
    const dataToSave = {
      name: payload.name,
      description: payload.description,
      price: payload.price ?? 0,
      priceFormatted: payload.priceFormatted || (payload.price === 0 ? 'Free' : `₹${(payload.price || 0).toLocaleString('en-IN')}`),
      version: payload.version || '1.0.0',
      status: payload.status || 'AVAILABLE',
      downloadLink: payload.downloadLink || null,
      websiteLink: payload.websiteLink || null,
      ...(payload.features ? { features: JSON.stringify(payload.features) } : {}),
    };

    if (id) {
      const updated = await db.softwareProduct.update({
        where: { id },
        data: dataToSave,
      });
      revalidatePath('/admin/software');
      revalidatePath('/software');
      return { success: true, item: updated };
    } else {
      const created = await db.softwareProduct.create({
        data: dataToSave,
      });
      revalidatePath('/admin/software');
      revalidatePath('/software');
      return { success: true, item: created };
    }
  } catch (error: any) {
    console.error('Error saving software JSON:', error);
    return { success: false, error: error.message };
  }
}

export async function updateSoftwareStatus(id: string, status: string) {
  await db.softwareProduct.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/admin/software');
  revalidatePath('/software');
}

export async function deleteSoftwareProduct(id: string) {
  await db.softwareProduct.delete({
    where: { id },
  });

  revalidatePath('/admin/software');
  revalidatePath('/software');
}
