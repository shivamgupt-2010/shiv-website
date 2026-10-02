'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createCoupon(formData: FormData) {
  const code = formData.get('code') as string;
  const discountType = formData.get('discountType') as string;
  const discountValue = parseFloat(formData.get('discountValue') as string);
  const minOrderValue = formData.get('minOrderValue') ? parseFloat(formData.get('minOrderValue') as string) : null;
  const active = formData.get('active') === 'on';

  await db.coupon.create({
    data: {
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minOrderValue,
      active,
    },
  });

  revalidatePath('/admin/coupons');
}

export async function toggleCouponStatus(id: string, active: boolean) {
  await db.coupon.update({
    where: { id },
    data: { active },
  });

  revalidatePath('/admin/coupons');
}

export async function deleteCoupon(id: string) {
  await db.coupon.delete({
    where: { id },
  });

  revalidatePath('/admin/coupons');
}
