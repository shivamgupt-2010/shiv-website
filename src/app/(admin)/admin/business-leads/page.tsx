import db from '@/lib/db';
import { getMergedServices, getServiceCategories } from '@/lib/servicesManager';
import AdminBusinessLeadsClient from './AdminBusinessLeadsClient';

export const dynamic = 'force-dynamic';

export default async function AdminBusinessLeadsPage() {
  const [leads, services, categories] = await Promise.all([
    db.businessLead.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    getMergedServices(),
    getServiceCategories(),
  ]);

  // Format leads for client component serialization
  const formattedLeads = leads.map((lead) => ({
    ...lead,
    createdAt: lead.createdAt.toISOString(),
  }));

  return (
    <AdminBusinessLeadsClient
      initialLeads={formattedLeads}
      initialServices={services}
      categories={categories}
    />
  );
}
