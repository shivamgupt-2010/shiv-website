import fs from 'fs';
import path from 'path';
import { MASTER_PACKAGES, PackageItem, PackageCategory, PACKAGE_CATEGORIES } from './businessPackagesData';

const PACKAGE_OVERRIDES_FILE = path.join(process.cwd(), 'src', 'data', 'package_overrides.json');

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

let overridesCache: PackageOverridesMap | null = null;

function loadPackageOverrides(): PackageOverridesMap {
  if (overridesCache) return overridesCache;

  try {
    if (fs.existsSync(PACKAGE_OVERRIDES_FILE)) {
      const data = fs.readFileSync(PACKAGE_OVERRIDES_FILE, 'utf-8');
      overridesCache = JSON.parse(data);
      return overridesCache || {};
    }
  } catch (error) {
    console.error('Error loading package overrides:', error);
  }
  return {};
}

function savePackageOverrides(overrides: PackageOverridesMap): boolean {
  try {
    const dir = path.dirname(PACKAGE_OVERRIDES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(PACKAGE_OVERRIDES_FILE, JSON.stringify(overrides, null, 2), 'utf-8');
    overridesCache = overrides;
    return true;
  } catch (error) {
    console.error('Error saving package overrides:', error);
    return false;
  }
}

/**
 * Returns all packages merged with custom admin overrides.
 */
export async function getMergedPackages(): Promise<PackageItem[]> {
  const overrides = loadPackageOverrides();

  return MASTER_PACKAGES.map((pkg) => {
    const override = overrides[pkg.id];
    if (!override) return pkg;

    return {
      ...pkg,
      name: override.name !== undefined ? override.name : pkg.name,
      price: override.price !== undefined ? override.price : pkg.price,
      priceFormatted: override.priceFormatted !== undefined ? override.priceFormatted : (override.price ? `₹${override.price.toLocaleString('en-IN')}` : pkg.priceFormatted),
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
 * Updates a specific package override from the admin dashboard.
 */
export async function updatePackageOverride(packageId: string, updates: PackageOverride): Promise<boolean> {
  const overrides = loadPackageOverrides();
  overrides[packageId] = {
    ...overrides[packageId],
    ...updates,
  };
  return savePackageOverrides(overrides);
}

/**
 * Resets a package to default master specs.
 */
export async function resetPackageOverride(packageId: string): Promise<boolean> {
  const overrides = loadPackageOverrides();
  delete overrides[packageId];
  return savePackageOverrides(overrides);
}

/**
 * Returns all package categories.
 */
export function getPackageCategories(): PackageCategory[] {
  return PACKAGE_CATEGORIES;
}
