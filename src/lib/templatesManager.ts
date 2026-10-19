import db from '@/lib/db';
import { MASTER_TEMPLATES, MarketplaceTemplate, TEMPLATE_CATEGORIES } from './templatesMarketplaceData';

export interface TemplateOverride {
  name?: string;
  basePrice?: number;
  description?: string;
  category?: 'design' | 'frontend' | 'backend' | 'fullstack' | 'automation' | 'bundles';
  categoryLabel?: string;
  subcategory?: string;
  techStack?: string[];
  demoUrl?: string;
  screenshotUrl?: string;
  fileContents?: string[];
  version?: string;
  badge?: string;
  featured?: boolean;
  active?: boolean;
}

export interface TemplateOverridesMap {
  [templateId: string]: TemplateOverride;
}

/**
 * Loads template overrides from PostgreSQL database with memory fallback.
 */
export async function loadTemplateOverrides(): Promise<TemplateOverridesMap> {
  try {
    const records = await db.catalogOverride.findMany({
      where: { type: 'TEMPLATE' },
    });
    const map: TemplateOverridesMap = {};
    for (const rec of records) {
      const templateId = rec.id.replace(/^template:/, '');
      try {
        map[templateId] = JSON.parse(rec.data);
      } catch {}
    }
    return map;
  } catch (error) {
    console.error('Error loading template overrides from db:', error);
    return {};
  }
}

/**
 * Returns all marketplace templates merged with custom admin database overrides.
 */
export async function getMergedTemplates(): Promise<MarketplaceTemplate[]> {
  const overrides = await loadTemplateOverrides();

  return MASTER_TEMPLATES.map((item) => {
    const override = overrides[item.id];
    if (!override) return item;

    return {
      ...item,
      name: override.name !== undefined ? override.name : item.name,
      basePrice: override.basePrice !== undefined ? override.basePrice : item.basePrice,
      description: override.description !== undefined ? override.description : item.description,
      category: override.category !== undefined ? override.category : item.category,
      categoryLabel: override.categoryLabel !== undefined ? override.categoryLabel : item.categoryLabel,
      subcategory: override.subcategory !== undefined ? override.subcategory : item.subcategory,
      techStack: override.techStack !== undefined ? override.techStack : item.techStack,
      demoUrl: override.demoUrl !== undefined ? override.demoUrl : item.demoUrl,
      screenshotUrl: override.screenshotUrl !== undefined ? override.screenshotUrl : item.screenshotUrl,
      fileContents: override.fileContents !== undefined ? override.fileContents : item.fileContents,
      version: override.version !== undefined ? override.version : item.version,
      badge: override.badge !== undefined ? override.badge : item.badge,
      featured: override.featured !== undefined ? override.featured : item.featured,
      active: override.active !== undefined ? override.active : (item.active ?? true),
    };
  });
}

/**
 * Get a single template by ID
 */
export async function getTemplateById(id: string): Promise<MarketplaceTemplate | null> {
  const all = await getMergedTemplates();
  return all.find((t) => t.id === id) || null;
}

/**
 * Updates a specific template override in PostgreSQL.
 */
export async function updateTemplateOverride(templateId: string, updates: TemplateOverride): Promise<boolean> {
  try {
    const overrideKey = `template:${templateId}`;
    const existing = await db.catalogOverride.findUnique({
      where: { id: overrideKey },
    });

    let existingData: TemplateOverride = {};
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
        type: 'TEMPLATE',
        data: JSON.stringify(merged),
      },
      update: {
        data: JSON.stringify(merged),
      },
    });

    return true;
  } catch (error) {
    console.error('Error updating template override in DB:', error);
    return false;
  }
}

/**
 * Resets a template to default master specs.
 */
export async function resetTemplateOverride(templateId: string): Promise<boolean> {
  try {
    const overrideKey = `template:${templateId}`;
    await db.catalogOverride.deleteMany({
      where: { id: overrideKey },
    });
    return true;
  } catch (error) {
    console.error('Error resetting template override in DB:', error);
    return false;
  }
}

/**
 * Toggle active status of a template
 */
export async function toggleTemplateActive(templateId: string, currentActive: boolean): Promise<boolean> {
  return updateTemplateOverride(templateId, { active: !currentActive });
}

/**
 * Returns all template categories with counts
 */
export function getTemplateCategories() {
  return TEMPLATE_CATEGORIES;
}
