'use server';

import { updateServiceOverride, resetServiceOverride, ServiceOverride } from '@/lib/servicesManager';
import { revalidatePath } from 'next/cache';

export async function adminUpdateService(serviceId: string, updates: ServiceOverride) {
  try {
    const success = await updateServiceOverride(serviceId, updates);
    revalidatePath('/business/services');
    revalidatePath('/admin/business-packages');
    revalidatePath('/admin/business-leads');
    return { success };
  } catch (error: any) {
    console.error('Error updating service override:', error);
    return { success: false, error: error.message };
  }
}

export async function adminResetService(serviceId: string) {
  try {
    const success = await resetServiceOverride(serviceId);
    revalidatePath('/business/services');
    revalidatePath('/admin/business-packages');
    revalidatePath('/admin/business-leads');
    return { success };
  } catch (error: any) {
    console.error('Error resetting service override:', error);
    return { success: false, error: error.message };
  }
}

export async function adminToggleServiceActive(serviceId: string, currentActive: boolean) {
  try {
    const success = await updateServiceOverride(serviceId, { active: !currentActive });
    revalidatePath('/business/services');
    revalidatePath('/admin/business-packages');
    revalidatePath('/admin/business-leads');
    return { success, newStatus: !currentActive };
  } catch (error: any) {
    console.error('Error toggling service status:', error);
    return { success: false, error: error.message };
  }
}
