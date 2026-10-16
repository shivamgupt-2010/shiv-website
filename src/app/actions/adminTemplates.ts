'use server';

import { revalidatePath } from 'next/cache';
import { updateTemplateOverride, resetTemplateOverride, toggleTemplateActive, TemplateOverride } from '@/lib/templatesManager';

export async function adminUpdateTemplate(templateId: string, updates: TemplateOverride) {
  try {
    const success = await updateTemplateOverride(templateId, updates);
    revalidatePath('/software');
    revalidatePath('/admin/software');
    return { success };
  } catch (error) {
    console.error('Error updating template:', error);
    return { success: false, error: 'Failed to update template' };
  }
}

export async function adminResetTemplate(templateId: string) {
  try {
    const success = await resetTemplateOverride(templateId);
    revalidatePath('/software');
    revalidatePath('/admin/software');
    return { success };
  } catch (error) {
    console.error('Error resetting template:', error);
    return { success: false, error: 'Failed to reset template' };
  }
}

export async function adminToggleTemplateActive(templateId: string, currentActive: boolean) {
  try {
    const success = await toggleTemplateActive(templateId, currentActive);
    revalidatePath('/software');
    revalidatePath('/admin/software');
    return { success, newStatus: !currentActive };
  } catch (error) {
    console.error('Error toggling template status:', error);
    return { success: false, error: 'Failed to toggle status' };
  }
}
