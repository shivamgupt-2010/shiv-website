import fs from 'fs';
import path from 'path';
import { MASTER_TEMPLATES, MarketplaceTemplate, TEMPLATE_CATEGORIES } from './templatesMarketplaceData';

const TEMPLATE_OVERRIDES_FILE = path.join(process.cwd(), 'src', 'data', 'template_overrides.json');

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

let overridesCache: TemplateOverridesMap | null = null;

function loadTemplateOverrides(): TemplateOverridesMap {
  if (overridesCache) return overridesCache;

  try {
    if (fs.existsSync(TEMPLATE_OVERRIDES_FILE)) {
      const data = fs.readFileSync(TEMPLATE_OVERRIDES_FILE, 'utf-8');
      overridesCache = JSON.parse(data);
      return overridesCache || {};
    }
  } catch (error) {
    console.error('Error loading template overrides:', error);
  }
  return {};
}

function saveTemplateOverrides(overrides: TemplateOverridesMap): boolean {
  try {
    const dir = path.dirname(TEMPLATE_OVERRIDES_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(TEMPLATE_OVERRIDES_FILE, JSON.stringify(overrides, null, 2), 'utf-8');
    overridesCache = overrides;
    return true;
  } catch (error) {
    console.error('Error saving template overrides:', error);
    return false;
  }
}

/**
 * Returns all marketplace templates merged with custom admin overrides.
 */
export async function getMergedTemplates(): Promise<MarketplaceTemplate[]> {
  const overrides = loadTemplateOverrides();

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
 * Updates a specific template override from the admin dashboard.
 */
export async function updateTemplateOverride(templateId: string, updates: TemplateOverride): Promise<boolean> {
  const overrides = loadTemplateOverrides();
  overrides[templateId] = {
    ...overrides[templateId],
    ...updates,
  };
  return saveTemplateOverrides(overrides);
}

/**
 * Resets a template to default master specs.
 */
export async function resetTemplateOverride(templateId: string): Promise<boolean> {
  const overrides = loadTemplateOverrides();
  delete overrides[templateId];
  return saveTemplateOverrides(overrides);
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
