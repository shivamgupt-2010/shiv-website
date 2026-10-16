import type { Metadata } from 'next';
import { getMergedServices, getServiceCategories } from '@/lib/servicesManager';
import { getMergedPackages, getPackageCategories } from '@/lib/packagesManager';
import ChooseServicesClient from './ChooseServicesClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Choose Your Services & Packages — Master Price Catalogue | SHIV Business',
  description: 'Explore transparent fixed-price service packages and custom engineering solutions by SHIV. Choose complete packages, build custom stacks from 295+ deliverables, or request custom enterprise solutions.',
  keywords: [
    'SHIV business services',
    'SHIV packages',
    'SHIV price catalogue',
    'website packages India',
    'local business launch packages',
    'social media monthly retainers',
    'Google Business setup',
    'Amazon seller onboarding India',
    'AI automation workflows',
    'custom web application development',
  ],
};

export default async function ChooseServicesPage() {
  const [services, categories, packages, packageCategories] = await Promise.all([
    getMergedServices(),
    getServiceCategories(),
    getMergedPackages(),
    getPackageCategories(),
  ]);

  return (
    <ChooseServicesClient
      initialServices={services}
      categories={categories}
      initialPackages={packages}
      packageCategories={packageCategories}
    />
  );
}
