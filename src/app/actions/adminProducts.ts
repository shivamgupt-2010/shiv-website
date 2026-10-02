'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import fs from 'fs';
import path from 'path';

export async function createProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const shortDescription = formData.get('shortDescription') as string || description.substring(0, 100);
  const price = parseFloat(formData.get('price') as string);
  const status = formData.get('status') as string || 'ACTIVE';
  const sku = formData.get('sku') as string || slug.toUpperCase();
  const stock = parseInt(formData.get('stock') as string) || 0;
  
  const imageFile = formData.get('image') as File | null;

  if (!name || !slug || !price) {
    throw new Error('Missing required fields');
  }

  const product = await db.product.create({
    data: {
      name,
      slug,
      description,
      shortDescription,
      price,
      status,
      sku,
      stock,
    },
  });

  if (imageFile && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const ext = path.extname(imageFile.name) || '.jpg';
    const filename = `${product.id}-${Date.now()}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    
    await db.productImage.create({
      data: {
        url: `/uploads/products/${filename}`,
        productId: product.id,
      }
    });
  }

  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const description = formData.get('description') as string;
  const shortDescription = formData.get('shortDescription') as string || description.substring(0, 100);
  const price = parseFloat(formData.get('price') as string);
  const status = formData.get('status') as string || 'ACTIVE';
  const sku = formData.get('sku') as string || slug.toUpperCase();
  const stock = parseInt(formData.get('stock') as string) || 0;
  
  const imageFile = formData.get('image') as File | null;

  await db.product.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      shortDescription,
      price,
      status,
      sku,
      stock,
    },
  });

  if (imageFile && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const ext = path.extname(imageFile.name) || '.jpg';
    const filename = `${id}-${Date.now()}${ext}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'products');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    
    await db.productImage.create({
      data: {
        url: `/uploads/products/${filename}`,
        productId: id,
      }
    });
  }

  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function deleteProduct(id: string) {
  await db.product.delete({
    where: { id },
  });

  revalidatePath('/admin/products');
}
