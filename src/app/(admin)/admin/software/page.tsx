import db from '@/lib/db';
import { getMergedTemplates } from '@/lib/templatesManager';
import AdminSoftwareClient from './AdminSoftwareClient';

export const dynamic = 'force-dynamic';

export default async function AdminSoftwarePage() {
  const [software, templates] = await Promise.all([
    db.softwareProduct.findMany().catch(() => []),
    getMergedTemplates(),
  ]);

  return <AdminSoftwareClient initialTemplates={templates} initialSoftware={software} />;
}
