'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Validates that the current user is the Super Admin (admin@shiv.com or SUPER_ADMIN role).
 * As per core business rule: All roles are assigned exclusively by Super Admin (admin@shiv.com).
 */
async function verifySuperAdmin() {
  const session = await getServerSession(authOptions);
  const userEmail = (session?.user?.email || '').toLowerCase().trim();
  const userRole = ((session?.user as any)?.role || '').toUpperCase();

  const isSuperAdmin = userEmail === 'admin@shiv.com' || userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';

  if (!isSuperAdmin) {
    throw new Error('Unauthorized: All roles must be assigned exclusively by Super Admin (admin@shiv.com).');
  }

  return session;
}

export async function createAdminUser(formData: FormData) {
  await verifySuperAdmin();

  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = (formData.get('password') as string)?.trim();
  const role = (formData.get('role') as string)?.toUpperCase();

  if (!name || !email || !password || !role) {
    throw new Error('All fields (name, email, password, role) are required');
  }

  // Allowed staff roles
  const validRoles = ['SUPER_ADMIN', 'SHOP_OWNER', 'MARKETER'];
  if (!validRoles.includes(role)) {
    throw new Error('Invalid role. Role must be SUPER_ADMIN, SHOP_OWNER, or MARKETER.');
  }

  // Check if user already exists
  const existingUser = await db.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: 'insensitive',
      },
    },
  });

  if (existingUser) {
    throw new Error(`A user with email ${email} already exists.`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  revalidatePath('/admin/users');
}

export async function updateUserRole(userId: string, newRole: string) {
  await verifySuperAdmin();

  const role = newRole.toUpperCase();
  const validRoles = ['SUPER_ADMIN', 'SHOP_OWNER', 'MARKETER', 'CUSTOMER'];
  if (!validRoles.includes(role)) {
    throw new Error('Invalid role.');
  }

  const targetUser = await db.user.findUnique({ where: { id: userId } });
  if (!targetUser) {
    throw new Error('User not found.');
  }

  // Prevent demoting the root admin@shiv.com
  if (targetUser.email.toLowerCase() === 'admin@shiv.com' && role !== 'SUPER_ADMIN') {
    throw new Error('Cannot change the role of the root Super Admin (admin@shiv.com).');
  }

  await db.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath('/admin/users');
}

export async function deleteUser(id: string) {
  await verifySuperAdmin();

  const targetUser = await db.user.findUnique({ where: { id } });
  if (!targetUser) {
    throw new Error('User not found.');
  }

  // Prevent deleting the root admin@shiv.com
  if (targetUser.email.toLowerCase() === 'admin@shiv.com') {
    throw new Error('Cannot delete the root Super Admin (admin@shiv.com).');
  }

  await db.user.delete({
    where: { id },
  });

  revalidatePath('/admin/users');
}
