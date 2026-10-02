import ProductForm from '../ProductForm';

export default function NewProductPage() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Add New Product</h1>
      <ProductForm />
    </div>
  );
}
