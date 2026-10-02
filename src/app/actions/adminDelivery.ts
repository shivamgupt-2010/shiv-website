'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createDeliveryMethod(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const minOrderValue = formData.get('minOrderValue') ? parseFloat(formData.get('minOrderValue') as string) : null;
  const estimatedDelivery = formData.get('estimatedDelivery') as string;
  const active = formData.get('active') === 'on';

  await db.deliveryMethod.create({
    data: {
      name,
      description,
      price,
      minOrderValue,
      estimatedDelivery,
      active,
    },
  });

  revalidatePath('/admin/delivery');
}

export async function toggleDeliveryMethodStatus(id: string, active: boolean) {
  await db.deliveryMethod.update({
    where: { id },
    data: { active },
  });

  revalidatePath('/admin/delivery');
}

export async function deleteDeliveryMethod(id: string) {
  await db.deliveryMethod.delete({
    where: { id },
  });

  revalidatePath('/admin/delivery');
}
