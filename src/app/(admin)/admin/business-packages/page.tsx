import { getMergedPackages, getPackageCategories } from '@/lib/packagesManager';
import AdminPackagesClient from './AdminPackagesClient';

export const dynamic = 'force-dynamic';

export default async function AdminPackagesPage() {
  const [packages, categories] = await Promise.all([
    getMergedPackages(),
    getPackageCategories(),
  ]);

  return <AdminPackagesClient initialPackages={packages} categories={categories} />;
}
