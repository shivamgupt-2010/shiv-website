import db from '@/lib/db';
import { MASTER_PACKAGES, PackageItem, PackageCategory, PACKAGE_CATEGORIES } from './businessPackagesData';

export interface PackageOverride {
  price?: number;
  priceFormatted?: string;
  name?: string;
  description?: string;
  deliverables?: string[];
  active?: boolean;
  featured?: boolean;
  scopeNotes?: string;
  badge?: string;
}

export interface PackageOverridesMap {
  [packageId: string]: PackageOverride;
}

/**
 * Loads package overrides from PostgreSQL database with memory fallback.
 */
export async function loadPackageOverrides(): Promise<PackageOverridesMap> {
  try {
    const records = await db.catalogOverride.findMany({
      where: { type: 'PACKAGE' },
    });
    const map: PackageOverridesMap = {};
    for (const rec of records) {
      const pkgId = rec.id.replace(/^package:/, '');
      try {
        map[pkgId] = JSON.parse(rec.data);
      } catch {}
    }
    return map;
  } catch (error) {
    console.error('Error loading package overrides from db:', error);
    return {};
  }
}

/**
 * Returns all packages merged with custom admin database overrides.
 */
export async function getMergedPackages(): Promise<PackageItem[]> {
  const overrides = await loadPackageOverrides();

  return MASTER_PACKAGES.map((pkg) => {
    const override = overrides[pkg.id];
    if (!override) return pkg;

    return {
      ...pkg,
      name: override.name !== undefined ? override.name : pkg.name,
      price: override.price !== undefined ? override.price : pkg.price,
      priceFormatted: override.priceFormatted !== undefined 
        ? override.priceFormatted 
        : (override.price ? `₹${override.price.toLocaleString('en-IN')}` : pkg.priceFormatted),
      description: override.description !== undefined ? override.description : pkg.description,
      deliverables: override.deliverables !== undefined ? override.deliverables : pkg.deliverables,
      active: override.active !== undefined ? override.active : (pkg.active ?? true),
      featured: override.featured !== undefined ? override.featured : (pkg.featured ?? false),
      scopeNotes: override.scopeNotes !== undefined ? override.scopeNotes : pkg.scopeNotes,
      badge: override.badge !== undefined ? override.badge : pkg.badge,
    };
  });
}

/**
 * Updates a specific package override in PostgreSQL.
 */
export async function updatePackageOverride(packageId: string, updates: PackageOverride): Promise<boolean> {
  try {
    const overrideKey = `package:${packageId}`;
    const existing = await db.catalogOverride.findUnique({
      where: { id: overrideKey },
    });

    let existingData: PackageOverride = {};
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
        type: 'PACKAGE',
        data: JSON.stringify(merged),
      },
      update: {
        data: JSON.stringify(merged),
      },
    });

    return true;
  } catch (error) {
    console.error('Error updating package override in DB:', error);
    return false;
  }
}

/**
 * Resets a package to default master specs.
 */
export async function resetPackageOverride(packageId: string): Promise<boolean> {
  try {
    const overrideKey = `package:${packageId}`;
    await db.catalogOverride.deleteMany({
      where: { id: overrideKey },
    });
    return true;
  } catch (error) {
    console.error('Error resetting package override in DB:', error);
    return false;
  }
}

/**
 * Returns all package categories.
 */
export function getPackageCategories(): PackageCategory[] {
  return PACKAGE_CATEGORIES;
}
