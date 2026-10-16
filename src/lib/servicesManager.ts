import fs from 'fs';
import path from 'path';
import { MASTER_SERVICES, ServiceItem, ServiceCategory, SERVICE_CATEGORIES } from './businessServicesData';

const OVERRIDES_FILE = path.join(process.cwd(), 'src', 'data', 'service_overrides.json');

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

// In-memory cache for fast read
let overridesCache: OverridesMap | null = null;

function loadOverrides(): OverridesMap {
  if (overridesCache) return overridesCache;

  try {
    if (fs.existsSync(OVERRIDES_FILE)) {
      const data = fs.readFileSync(OVERRIDES_FILE, 'utf-8');
      overridesCache = JSON.parse(data);
      return overridesCache || {};
    }
  } catch (error) {
    console.error('Error loading service overrides:', error);
  }
  return {};
}

function saveOverrides(overrides: OverridesMap): boolean {
  try {
    const dir = path.dirname(OVERRIDES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(OVERRIDES_FILE, JSON.stringify(overrides, null, 2), 'utf-8');
    overridesCache = overrides;
    return true;
  } catch (error) {
    console.error('Error saving service overrides:', error);
    return false;
  }
}

/**
 * Returns all services merged with any custom admin overrides.
 */
export async function getMergedServices(): Promise<ServiceItem[]> {
  const overrides = loadOverrides();

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
 * Updates a specific service override from the admin dashboard.
 */
export async function updateServiceOverride(serviceId: string, updates: ServiceOverride): Promise<boolean> {
  const overrides = loadOverrides();
  overrides[serviceId] = {
    ...overrides[serviceId],
    ...updates,
  };
  return saveOverrides(overrides);
}

/**
 * Resets a service to default master catalogue specs.
 */
export async function resetServiceOverride(serviceId: string): Promise<boolean> {
  const overrides = loadOverrides();
  delete overrides[serviceId];
  return saveOverrides(overrides);
}

/**
 * Categories list with helper.
 */
export function getServiceCategories(): ServiceCategory[] {
  return SERVICE_CATEGORIES;
}
