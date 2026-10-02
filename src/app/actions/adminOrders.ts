'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatus(orderId: string, status: string) {
  await db.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath('/admin/orders');
}

export async function updateOrderTracking(orderId: string, trackingNumber: string) {
  await db.order.update({
    where: { id: orderId },
    data: { trackingNumber },
  });

  revalidatePath(`/admin/orders/${orderId}`);
}
