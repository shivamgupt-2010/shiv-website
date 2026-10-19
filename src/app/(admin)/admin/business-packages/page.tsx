import { getMergedPackages, getPackageCategories } from '@/lib/packagesManager';
import { getMergedServices, getServiceCategories } from '@/lib/servicesManager';
import AdminPackagesClient from './AdminPackagesClient';

export const dynamic = 'force-dynamic';

export default async function AdminPackagesPage() {
  const [packages, packageCategories, services, serviceCategories] = await Promise.all([
    getMergedPackages(),
    getPackageCategories(),
    getMergedServices(),
    getServiceCategories(),
  ]);

  return (
    <AdminPackagesClient 
      initialPackages={packages} 
      categories={packageCategories} 
      initialServices={services}
      serviceCategories={serviceCategories}
    />
  );
}
