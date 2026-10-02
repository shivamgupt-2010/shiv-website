import db from '@/lib/db';
import ProductForm from '../../ProductForm';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: { id }
  });

  if (!product) {
    notFound();
  }

  // Convert Decimal price to number for the form
  const productForForm = {
    ...product,
    price: Number(product.price)
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Edit Product: {product.name}</h1>
      <ProductForm product={productForForm} />
    </div>
  );
}
