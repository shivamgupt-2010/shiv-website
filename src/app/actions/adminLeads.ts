'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateLeadStatus(id: string, status: string) {
  await db.businessLead.update({
    where: { id },
    data: { status },
  });

  revalidatePath(`/admin/business-leads/${id}`);
  revalidatePath('/admin/business-leads');
}

export async function updateLeadNotes(id: string, notes: string) {
  await db.businessLead.update({
    where: { id },
    data: { notes },
  });

  revalidatePath(`/admin/business-leads/${id}`);
}

export async function archiveLead(id: string, archived: boolean) {
  await db.businessLead.update({
    where: { id },
    data: { archived },
  });

  revalidatePath('/admin/business-leads');
}
