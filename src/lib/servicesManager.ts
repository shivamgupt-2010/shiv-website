import db from '@/lib/db';
import { MASTER_SERVICES, ServiceItem, ServiceCategory, SERVICE_CATEGORIES } from './businessServicesData';

export interface ServiceOverride {
  price?: number;
  turnaround?: string;
  deliverable?: string;
  active?: boolean;
  scopeRules?: string;
}

export interface OverridesMap {
  [serviceId: string]: ServiceOverride;
}

/**
 * Loads service overrides from PostgreSQL database with memory fallback.
 */
export async function loadServiceOverrides(): Promise<OverridesMap> {
  try {
    const records = await db.catalogOverride.findMany({
      where: { type: 'SERVICE' },
    });
    const map: OverridesMap = {};
    for (const rec of records) {
      const srvId = rec.id.replace(/^service:/, '');
      try {
        map[srvId] = JSON.parse(rec.data);
      } catch {}
    }
    return map;
  } catch (error) {
    console.error('Error loading service overrides from db:', error);
    return {};
  }
}

/**
 * Returns all services merged with custom admin database overrides.
 */
export async function getMergedServices(): Promise<ServiceItem[]> {
  const overrides = await loadServiceOverrides();

  return MASTER_SERVICES.map((srv) => {
    const override = overrides[srv.id];
    if (!override) return srv;

    return {
      ...srv,
      price: override.price !== undefined ? override.price : srv.price,
      turnaround: override.turnaround !== undefined ? override.turnaround : srv.turnaround,
      deliverable: override.deliverable !== undefined ? override.deliverable : srv.deliverable,
      active: override.active !== undefined ? override.active : (srv.active ?? true),
      scopeRules: override.scopeRules !== undefined ? override.scopeRules : srv.scopeRules,
    };
  });
}

/**
 * Updates a specific service override in PostgreSQL.
 */
export async function updateServiceOverride(serviceId: string, updates: ServiceOverride): Promise<boolean> {
  try {
    const overrideKey = `service:${serviceId}`;
    const existing = await db.catalogOverride.findUnique({
      where: { id: overrideKey },
    });

    let existingData: ServiceOverride = {};
    if (existing) {
      try {
        existingData = JSON.parse(existing.data);
      } catch {}
    }

    const merged = { ...existingData, ...updates };

    await db.catalogOverride.upsert({
      where: { id: overrideKey },
      create: {
        id: overrideKey,
        type: 'SERVICE',
        data: JSON.stringify(merged),
      },
      update: {
        data: JSON.stringify(merged),
      },
    });

    return true;
  } catch (error) {
    console.error('Error updating service override in DB:', error);
    return false;
  }
}

/**
 * Resets a service to default master catalogue specs.
 */
export async function resetServiceOverride(serviceId: string): Promise<boolean> {
  try {
    const overrideKey = `service:${serviceId}`;
    await db.catalogOverride.deleteMany({
      where: { id: overrideKey },
    });
    return true;
  } catch (error) {
    console.error('Error resetting service override in DB:', error);
    return false;
  }
}

/**
 * Categories list with helper.
 */
export function getServiceCategories(): ServiceCategory[] {
  return SERVICE_CATEGORIES;
}
