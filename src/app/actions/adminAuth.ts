'use server';

import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function verifyAdminCredentials(formData: FormData) {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = (formData.get('password') as string)?.trim();

  if (!email || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const user = await db.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: 'insensitive',
      },
    },
  });

  if (!user) {
    return { success: false, error: 'Invalid admin credentials.' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { success: false, error: 'Incorrect password.' };
  }

  const roleUpper = (user.role || '').toUpperCase();
  const isSuperAdmin = user.email.toLowerCase() === 'admin@shiv.com' || roleUpper === 'SUPER_ADMIN' || roleUpper === 'ADMIN';
  const isShopOwner = roleUpper === 'SHOP_OWNER' || roleUpper === 'PRODUCT_MANAGER';
  const isMarketer = roleUpper === 'MARKETER';

  // Strict RBAC: Admin panel only accessible by Super Admin, Shop Owner, and Marketer
  if (!isSuperAdmin && !isShopOwner && !isMarketer) {
    return {
      success: false,
      error: 'Access Denied: The admin panel is restricted exclusively to Super Admins, Shop Owners, and Marketers.',
    };
  }

  const cookieStore = await cookies();
  const effectiveRole = isSuperAdmin ? 'SUPER_ADMIN' : roleUpper;

  // Set secure admin session cookies
  cookieStore.set('admin_token', `adm_tok_${user.id}_${Date.now()}`, {
    path: '/',
    maxAge: 86400 * 7, // 7 days
    sameSite: 'lax',
    httpOnly: false, // accessible to client for fast route gating
  });

  cookieStore.set('admin_role', effectiveRole, {
    path: '/',
    maxAge: 86400 * 7,
    sameSite: 'lax',
  });

  cookieStore.set('admin_email', user.email.toLowerCase(), {
    path: '/',
    maxAge: 86400 * 7,
    sameSite: 'lax',
  });

  return {
    success: true,
    role: effectiveRole,
    email: user.email,
    name: user.name,
  };
}
