import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const v1Products = [
  {
    name: 'SHIV Classic T-Shirt',
    slug: 'shiv-classic-t-shirt',
    description: 'Premium cotton. Timeless design. Built for everyday essentials.',
    shortDescription: 'Built for everyday essentials.',
    price: 1299,
    sku: 'SHIV-APP-TSHIRT-001',
    stock: 100,
    status: 'ACTIVE',
    categoryName: 'Apparel',
    sizes: ['S', 'M', 'L', 'XL'],
    variants: ['Obsidian', 'White', 'Charcoal'],
    isCustomizable: false,
  },
  {
    name: 'SHIV Hoodie',
    slug: 'shiv-hoodie',
    description: 'Comfort meets statement. Stay warm. Stay you.',
    shortDescription: 'Comfort meets statement.',
    price: 2499,
    sku: 'SHIV-APP-HOODIE-001',
    stock: 50,
    status: 'ACTIVE',
    categoryName: 'Apparel',
    sizes: ['S', 'M', 'L', 'XL'],
    variants: ['Obsidian', 'Slate'],
    isCustomizable: true,
  },
  {
    name: 'SHIV Phone Cover',
    slug: 'shiv-phone-cover',
    description: 'Durable. Sleek. Yours. Small details. Big style.',
    shortDescription: 'Small details. Big style.',
    price: 999,
    sku: 'SHIV-ACC-PHONECVR-001',
    stock: 200,
    status: 'ACTIVE',
    categoryName: 'Accessories',
    sizes: [],
    variants: ['Matte Black', 'Transparent', 'Electric Blue Accent'],
    isCustomizable: true,
  },
  {
    name: 'SHIV Jacket',
    slug: 'shiv-jacket',
    description: 'Built for every journey. Built for every season.',
    shortDescription: 'Built for every journey.',
    price: 3499,
    sku: 'SHIV-APP-JACKET-001',
    stock: 0,
    status: 'OUT_OF_STOCK', // Or 'DRAFT'
    categoryName: 'Apparel',
    sizes: ['M', 'L', 'XL'],
    variants: ['Obsidian'],
    isCustomizable: false,
  },
  {
    name: 'SHIV Desk Mat',
    slug: 'shiv-desk-mat',
    description: 'Minimal cinematic foundation for your workspace.',
    shortDescription: 'Foundation for your workspace.',
    price: 1499,
    sku: 'SHIV-DEC-DESKMAT-001',
    stock: 75,
    status: 'ACTIVE',
    categoryName: 'Decorations',
    sizes: ['Standard', 'Extended'],
    variants: [],
    isCustomizable: false,
  },
];

async function main() {
  console.log('Seeding products...');

  // 1. Ensure categories exist
  const categories = ['Apparel', 'Accessories', 'Decorations'];
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.toLowerCase() },
      update: {},
      create: {
        name: cat,
        slug: cat.toLowerCase(),
      }
    });
  }

  // 2. Insert Products
  for (const p of v1Products) {
    const category = await prisma.category.findUnique({
      where: { slug: p.categoryName.toLowerCase() }
    });

    if (!category) continue;

    const createdProduct = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDescription: p.shortDescription,
        price: p.price,
        sku: p.sku,
        stock: p.stock,
        status: p.status,
        customizable: p.isCustomizable,
        categories: {
          connect: { id: category.id }
        }
      }
    });

    // 3. Create variants and sizes
    // We model sizes and color variants as ProductVariant
    if (p.sizes.length > 0) {
      for (const size of p.sizes) {
        await prisma.productVariant.upsert({
          where: { sku: `${p.sku}-SIZE-${size}` },
          update: {},
          create: {
            productId: createdProduct.id,
            name: 'Size',
            value: size,
            sku: `${p.sku}-SIZE-${size}`,
            stock: p.stock, // Give variants same stock for now
          }
        });
      }
    }

    if (p.variants.length > 0) {
      for (const color of p.variants) {
        const safeColorSku = color.replace(/\s+/g, '').toUpperCase();
        await prisma.productVariant.upsert({
          where: { sku: `${p.sku}-COLOR-${safeColorSku}` },
          update: {},
          create: {
            productId: createdProduct.id,
            name: 'Variant',
            value: color,
            sku: `${p.sku}-COLOR-${safeColorSku}`,
            stock: p.stock,
          }
        });
      }
    }
  }

  console.log('Products seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
