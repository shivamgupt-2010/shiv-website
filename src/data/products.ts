export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  category: 'Apparel' | 'Accessories' | 'Decorations';
  status: 'In Stock' | 'Pre-order' | 'Sold Out';
  variants?: string[];
  sizes?: string[];
  isCustomizable: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'SHIV Classic T-Shirt',
    slug: 'shiv-classic-t-shirt',
    description: 'Premium cotton. Timeless design. Built for everyday essentials.',
    price: '₹1,299',
    category: 'Apparel',
    status: 'In Stock',
    sizes: ['S', 'M', 'L', 'XL'],
    variants: ['Obsidian', 'White', 'Charcoal'],
    isCustomizable: false,
  },
  {
    id: '2',
    name: 'SHIV Hoodie',
    slug: 'shiv-hoodie',
    description: 'Comfort meets statement. Stay warm. Stay you.',
    price: '₹2,499',
    category: 'Apparel',
    status: 'In Stock',
    sizes: ['S', 'M', 'L', 'XL'],
    variants: ['Obsidian', 'Slate'],
    isCustomizable: true,
  },
  {
    id: '3',
    name: 'SHIV Phone Cover',
    slug: 'shiv-phone-cover',
    description: 'Durable. Sleek. Yours. Small details. Big style.',
    price: '₹999',
    category: 'Accessories',
    status: 'In Stock',
    variants: ['Matte Black', 'Transparent', 'Electric Blue Accent'],
    isCustomizable: true,
  },
  {
    id: '4',
    name: 'SHIV Jacket',
    slug: 'shiv-jacket',
    description: 'Built for every journey. Built for every season.',
    price: '₹3,499',
    category: 'Apparel',
    status: 'Pre-order',
    sizes: ['M', 'L', 'XL'],
    variants: ['Obsidian'],
    isCustomizable: false,
  },
  {
    id: '5',
    name: 'SHIV Desk Mat',
    slug: 'shiv-desk-mat',
    description: 'Minimal cinematic foundation for your workspace.',
    price: '₹1,499',
    category: 'Decorations',
    status: 'In Stock',
    sizes: ['Standard', 'Extended'],
    isCustomizable: false,
  },
];

export const featuredProductIds = ['1', '2', '3', '4'];
