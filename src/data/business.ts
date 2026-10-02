export interface BusinessPackage {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
}

export const businessPackages: BusinessPackage[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '₹24,999+',
    description: 'For businesses that need a professional online presence.',
    features: [
      'Business Website',
      'Mobile Optimized',
      'Contact Integration',
      'Basic SEO',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '₹49,999+',
    description: 'For businesses that need a more advanced digital presence.',
    features: [
      'Custom Design',
      'Forms & Maps',
      'Advanced SEO',
      'CMS Integration',
    ],
  },
  {
    id: 'custom',
    name: 'Business Pro',
    price: 'Custom',
    description: 'For businesses requiring custom software or specialized functionality.',
    features: [
      'Dashboard & Features',
      'Database Integration',
      'Maintenance',
      'Dedicated Support',
    ],
  },
];

export interface Project {
  id: string;
  client: string;
  category: string;
  description: string;
  features: string[];
}

export const showcaseProjects: Project[] = [
  {
    id: '1',
    client: 'Acme Corp',
    category: 'E-commerce',
    description: 'A complete custom e-commerce solution with advanced inventory management.',
    features: ['Custom Cart', 'Payment Gateway', 'Inventory Sync'],
  },
  {
    id: '2',
    client: 'TechFlow',
    category: 'SaaS Platform',
    description: 'A sleek, modern dashboard for monitoring cloud infrastructure metrics.',
    features: ['Real-time Data', 'User Authentication', 'Responsive Dashboard'],
  },
];
