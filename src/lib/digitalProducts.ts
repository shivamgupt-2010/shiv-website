import db from '@/lib/db';
import { MASTER_TEMPLATES, MarketplaceTemplate, LICENSE_CONFIG, LicenseType } from './templatesMarketplaceData';
import { getMergedTemplates } from './templatesManager';

export interface DigitalCategory {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  iconName: string;
  color: string;
  itemCount: number;
}

export interface DigitalProduct {
  id: string;
  slug: string;
  name: string;
  category: string; // website-templates, animations, ui-kits, frontend, backend, saas-kits, graphics, bundles
  categoryLabel: string;
  subcategory: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  longDescription?: string;
  techStack: string[];
  features: string[];
  includedFiles: string[];
  version: string;
  badge?: string;
  featured?: boolean;
  demoUrl?: string;
  screenshotUrl?: string;
  downloadFileName?: string;
  rating?: number;
  reviewsCount?: number;
}

export const DIGITAL_CATEGORIES: DigitalCategory[] = [
  {
    id: 'cat-clothes',
    slug: 'clothes',
    name: 'Clothes & Streetwear',
    shortDesc: 'Heavyweight loopback cotton hoodies, minimalist cyber tees, and techwear apparel.',
    iconName: 'Shirt',
    color: '#38bdf8',
    itemCount: 8,
  },
  {
    id: 'cat-shoes',
    slug: 'shoes',
    name: 'Shoes & Footwear',
    shortDesc: 'Handcrafted Italian leather high-top sneakers and vulcanized footwear.',
    iconName: 'Footprints',
    color: '#f97316',
    itemCount: 4,
  },
  {
    id: 'cat-accessories',
    slug: 'accessories',
    name: 'Accessories & Gear',
    shortDesc: 'Branded hardware badges, tactile metal keychains, and protective caps.',
    iconName: 'Watch',
    color: '#a855f7',
    itemCount: 6,
  },
  {
    id: 'cat-decor',
    slug: 'decor',
    name: 'Decor & Living',
    shortDesc: 'Minimalist concrete desk trays, ambient glow lamps, and tactile workspace objects.',
    iconName: 'Lamp',
    color: '#34d399',
    itemCount: 5,
  },
  {
    id: 'cat-paintings',
    slug: 'paintings',
    name: 'Paintings & Canvas Art',
    shortDesc: 'Original textured acrylic paintings on Belgian linen and geometric canvas art.',
    iconName: 'Palette',
    color: '#ec4899',
    itemCount: 6,
  },
  {
    id: 'cat-website-templates',
    slug: 'website-templates',
    name: 'Website Templates',
    shortDesc: 'SaaS landing pages, agency sites, portfolios, and e-commerce storefronts.',
    iconName: 'Layout',
    color: '#38bdf8',
    itemCount: 20,
  },
  {
    id: 'cat-animations',
    slug: 'animations',
    name: 'Animations & Effects',
    shortDesc: 'Interactive motion components, smooth scroll reveals, 3D cards, and hover effects.',
    iconName: 'Sparkles',
    color: '#ec4899',
    itemCount: 14,
  },
  {
    id: 'cat-ui-kits',
    slug: 'ui-kits',
    name: 'UI Kits & Components',
    shortDesc: 'Production-ready dashboard UI kits, modal systems, pricing tables, and form packs.',
    iconName: 'Layers',
    color: '#a855f7',
    itemCount: 13,
  },
  {
    id: 'cat-frontend',
    slug: 'frontend',
    name: 'Frontend Code',
    shortDesc: 'Clean React components, Tailwind design systems, responsive layouts, and hook packs.',
    iconName: 'Code',
    color: '#10b981',
    itemCount: 12,
  },
  {
    id: 'cat-backend',
    slug: 'backend',
    name: 'Backend Starters',
    shortDesc: 'FastAPI architectures, Node.js REST starters, JWT auth, and database modules.',
    iconName: 'Server',
    color: '#f97316',
    itemCount: 15,
  },
  {
    id: 'cat-saas-kits',
    slug: 'saas-kits',
    name: 'SaaS Starter Kits',
    shortDesc: 'End-to-end fullstack starters with auth, payments, dashboards, and role management.',
    iconName: 'Rocket',
    color: '#6366f1',
    itemCount: 8,
  },
  {
    id: 'cat-graphics',
    slug: 'graphics',
    name: 'Graphics & Branding',
    shortDesc: 'Figma UI kits, vector icon sets, social media templates, and brand design assets.',
    iconName: 'Palette',
    color: '#eab308',
    itemCount: 8,
  },
  {
    id: 'cat-bundles',
    slug: 'bundles',
    name: 'Bundles & Collections',
    shortDesc: 'Curated developer toolkits with massive multi-product bundle savings.',
    iconName: 'PackageCheck',
    color: '#06b6d4',
    itemCount: 5,
  },
];

/**
 * Maps subcategory names to the 8 standard digital categories
 */
function mapToDigitalCategory(item: MarketplaceTemplate): { category: string; categoryLabel: string } {
  const sub = item.subcategory.toLowerCase();
  const cat = item.category.toLowerCase();

  if (cat === 'bundles' || sub.includes('bundle')) {
    return { category: 'bundles', categoryLabel: 'Bundles & Collections' };
  }
  if (sub.includes('animation') || sub.includes('interactive component')) {
    return { category: 'animations', categoryLabel: 'Animations & Effects' };
  }
  if (sub.includes('ui kit') || sub.includes('component pack') || sub.includes('pricing table') || sub.includes('dashboard ui')) {
    return { category: 'ui-kits', categoryLabel: 'UI Kits & Components' };
  }
  if (sub.includes('full-stack') || sub.includes('saas') || sub.includes('application starter')) {
    return { category: 'saas-kits', categoryLabel: 'SaaS Starter Kits' };
  }
  if (sub.includes('backend') || sub.includes('api') || sub.includes('fastapi') || sub.includes('jwt') || sub.includes('database')) {
    return { category: 'backend', categoryLabel: 'Backend Starters' };
  }
  if (sub.includes('figma') || sub.includes('design template') || sub.includes('icon') || sub.includes('branding')) {
    return { category: 'graphics', categoryLabel: 'Graphics & Branding' };
  }
  if (sub.includes('website ui') || sub.includes('industry-specific') || sub.includes('landing') || sub.includes('portfolio') || sub.includes('storefront')) {
    return { category: 'website-templates', categoryLabel: 'Website Templates' };
  }

  // Fallback to frontend
  return { category: 'frontend', categoryLabel: 'Frontend Code' };
}

/**
 * Convert master template item to rich unified digital product
 */
export function templateToDigitalProduct(item: MarketplaceTemplate): DigitalProduct {
  const { category, categoryLabel } = mapToDigitalCategory(item);
  const slug = item.id.replace(/^tpl-/, '');

  return {
    id: item.id,
    slug,
    name: item.name,
    category,
    categoryLabel,
    subcategory: item.subcategory,
    price: item.basePrice,
    compareAtPrice: Math.round(item.basePrice * 1.4),
    description: item.description,
    longDescription: `${item.description} Built with modular architecture, strict typing, responsive layout, and production-tested patterns by SHIV Technologies.`,
    techStack: item.techStack,
    features: [
      'Production-tested, clean source code',
      'Fully responsive & mobile-optimized',
      'Zero unnecessary third-party dependencies',
      'Comprehensive step-by-step documentation',
      'Free lifetime patches & bug fixes',
      'Commercial usage license available',
    ],
    includedFiles: item.fileContents.length > 0 ? item.fileContents : [
      'Source Code (.tsx / .ts / .js)',
      'Documentation & Setup Guide (README.md)',
      'Configuration files (.json, .config)',
      'Asset previews & styling templates',
    ],
    version: item.version || '1.0.0',
    badge: item.badge,
    featured: item.featured || item.basePrice >= 999,
    demoUrl: item.demoUrl,
    screenshotUrl: item.screenshotUrl,
    downloadFileName: `${slug}-v${item.version || '1.0.0'}.zip`,
    rating: 4.9,
    reviewsCount: 14 + (item.basePrice % 20),
  };
}

/**
 * Returns all digital products merged with custom admin overrides
 */
export async function getAllDigitalProducts(): Promise<DigitalProduct[]> {
  const templates = await getMergedTemplates();
  const templateProducts = templates
    .filter((t) => t.active !== false)
    .map(templateToDigitalProduct);

  try {
    const dbProducts = await db.product.findMany({
      where: { status: 'ACTIVE' },
      include: { categories: true, images: true },
    });

    const mappedDbProducts: DigitalProduct[] = dbProducts.map((p) => {
      const catSlug = p.categories[0]?.slug || 'clothes';
      const catName = p.categories[0]?.name || 'Apparel';
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        category: catSlug,
        categoryLabel: catName,
        subcategory: catName,
        price: p.price,
        compareAtPrice: p.compareAtPrice || Math.round(p.price * 1.3),
        description: p.shortDescription || p.description,
        longDescription: p.description,
        techStack: ['Official SHIV Original', 'Premium Craftsmanship', 'Physical Drop'],
        features: [
          'Engineered with premium materials for maximum durability',
          'Authentic SHIV holographic verification certificate',
          'Insured doorstep delivery across India with live tracking',
          '7-day hassle-free replacement guarantee',
        ],
        includedFiles: ['Physical Product (Carefully Packaged)', 'Authenticity Certificate', 'Custom Brand Stickers'],
        version: '1.0',
        featured: p.featured,
        screenshotUrl: p.images[0]?.url,
        rating: 4.9,
        reviewsCount: 38,
      };
    });

    return [...mappedDbProducts, ...templateProducts];
  } catch (err) {
    return templateProducts;
  }
}

/**
 * Returns a single digital product by slug or id
 */
export async function getDigitalProductBySlug(slugOrId: string): Promise<DigitalProduct | null> {
  const all = await getAllDigitalProducts();
  const normalized = slugOrId.toLowerCase().replace(/^tpl-/, '');
  return (
    all.find((p) => p.slug === normalized || p.id === slugOrId || p.id === `tpl-${normalized}`) || null
  );
}

/**
 * Returns featured digital products for the homepage
 */
export async function getFeaturedDigitalProducts(limit = 8): Promise<DigitalProduct[]> {
  const all = await getAllDigitalProducts();
  // Pick curated prominent items across categories
  const featured = all.filter((p) => p.featured || p.badge);
  if (featured.length >= limit) return featured.slice(0, limit);
  return all.slice(0, limit);
}

/**
 * Returns digital products by category slug
 */
export async function getDigitalProductsByCategory(categorySlug: string): Promise<DigitalProduct[]> {
  const all = await getAllDigitalProducts();
  if (!categorySlug || categorySlug === 'all') return all;
  return all.filter((p) => p.category === categorySlug);
}

/**
 * Search digital products with multi-attribute filtering
 */
export async function searchDigitalProducts(params: {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  tech?: string;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}): Promise<DigitalProduct[]> {
  let products = await getAllDigitalProducts();

  // Category filter
  if (params.category && params.category !== 'all') {
    products = products.filter((p) => p.category === params.category);
  }

  // Keyword query
  if (params.query && params.query.trim()) {
    const q = params.query.toLowerCase().trim();
    products = products.filter((p) => {
      const inName = p.name.toLowerCase().includes(q);
      const inDesc = p.description.toLowerCase().includes(q);
      const inSub = p.subcategory.toLowerCase().includes(q);
      const inTech = p.techStack.some((t) => t.toLowerCase().includes(q));
      return inName || inDesc || inSub || inTech;
    });
  }

  // Tech stack filter
  if (params.tech && params.tech !== 'all') {
    const t = params.tech.toLowerCase();
    products = products.filter((p) =>
      p.techStack.some((tech) => tech.toLowerCase().includes(t))
    );
  }

  // Price range filter
  if (params.minPrice !== undefined) {
    products = products.filter((p) => p.price >= params.minPrice!);
  }
  if (params.maxPrice !== undefined) {
    products = products.filter((p) => p.price <= params.maxPrice!);
  }

  // Sorting
  if (params.sortBy === 'price-asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (params.sortBy === 'price-desc') {
    products.sort((a, b) => b.price - a.price);
  } else if (params.sortBy === 'popular') {
    products.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
  }

  return products;
}

/**
 * Returns digital categories with actual dynamic product counts
 */
export async function getDynamicCategories(): Promise<DigitalCategory[]> {
  const products = await getAllDigitalProducts();
  return DIGITAL_CATEGORIES.map((cat) => {
    const count = products.filter((p) => p.category === cat.slug).length;
    return {
      ...cat,
      itemCount: count,
    };
  });
}
