'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createPaymentMethod(formData: FormData) {
  const name = formData.get('name') as string;
  const provider = formData.get('provider') as string;
  const displayName = formData.get('displayName') as string;
  const description = formData.get('description') as string;
  const displayOrder = parseInt(formData.get('displayOrder') as string) || 0;
  const active = formData.get('active') === 'on';

  await db.paymentMethod.create({
    data: {
      name,
      provider,
      displayName,
      description,
      displayOrder,
      active,
    },
  });

  revalidatePath('/admin/payments');
}

export async function togglePaymentMethodStatus(id: string, active: boolean) {
  await db.paymentMethod.update({
    where: { id },
    data: { active },
  });

  revalidatePath('/admin/payments');
}

export async function deletePaymentMethod(id: string) {
  await db.paymentMethod.delete({
    where: { id },
  });

  revalidatePath('/admin/payments');
}
