'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createBusinessPackage(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = formData.get('price') as string;
  const featuresText = formData.get('features') as string;
  const cta = formData.get('cta') as string;
  const displayOrder = parseInt(formData.get('displayOrder') as string) || 0;
  const featured = formData.get('featured') === 'on';
  const active = formData.get('active') === 'on';

  // Split lines into JSON array
  const features = JSON.stringify(featuresText.split('\n').filter(f => f.trim() !== ''));

  await db.businessPackage.create({
    data: {
      name,
      description,
      price,
      features,
      cta: cta || 'Get Started',
      displayOrder,
      featured,
      active,
    },
  });

  revalidatePath('/admin/business-packages');
}

export async function togglePackageStatus(id: string, active: boolean) {
  await db.businessPackage.update({
    where: { id },
    data: { active },
  });

  revalidatePath('/admin/business-packages');
}

export async function deleteBusinessPackage(id: string) {
  await db.businessPackage.delete({
    where: { id },
  });

  revalidatePath('/admin/business-packages');
}

export async function updateBusinessPackage(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = formData.get('price') as string;
  const featuresText = formData.get('features') as string;
  const cta = formData.get('cta') as string;
  const displayOrder = parseInt(formData.get('displayOrder') as string) || 0;
  const featured = formData.get('featured') === 'on';
  const active = formData.get('active') === 'on';

  // Split lines into JSON array
  const features = JSON.stringify(featuresText.split('\n').filter(f => f.trim() !== ''));

  await db.businessPackage.update({
    where: { id },
    data: {
      name,
      description,
      price,
      features,
      cta: cta || 'Get Started',
      displayOrder,
      featured,
      active,
    },
  });

  revalidatePath('/admin/business-packages');
  revalidatePath('/business/services');
}

export async function adminUpdateMasterPackage(packageId: string, updates: any) {
  const { updatePackageOverride } = await import('@/lib/packagesManager');
  const success = await updatePackageOverride(packageId, updates);
  revalidatePath('/admin/business-packages');
  revalidatePath('/business/services');
  return { success };
}

export async function adminResetMasterPackage(packageId: string) {
  const { resetPackageOverride } = await import('@/lib/packagesManager');
  const success = await resetPackageOverride(packageId);
  revalidatePath('/admin/business-packages');
  revalidatePath('/business/services');
  return { success };
}

export async function adminToggleMasterPackageActive(packageId: string, currentActive: boolean) {
  const { updatePackageOverride } = await import('@/lib/packagesManager');
  const success = await updatePackageOverride(packageId, { active: !currentActive });
  revalidatePath('/admin/business-packages');
  revalidatePath('/business/services');
  return { success, newStatus: !currentActive };
}

