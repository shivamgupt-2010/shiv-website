'use server';

import db from '@/lib/db';
import { randomBytes } from 'crypto';

type CheckoutInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  items: {
    productId: string;
    variantId?: string; // Currently we are passing variant names in the CartContext, not IDs, let's look them up or just store options
    size?: string;
    variant?: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  deliveryFee: number;
};

export async function processCheckout(input: CheckoutInput) {
  try {
    // Generate an order number
    const orderNumber = `SHIV-${randomBytes(3).toString('hex').toUpperCase()}`;

    // Create the order using a transaction
    const order = await db.order.create({
      data: {
        orderNumber,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        status: 'PENDING',
        subtotal: input.subtotal,
        deliveryFee: input.deliveryFee,
        tax: 0,
        discount: 0,
        total: input.subtotal + input.deliveryFee,
        
        address: {
          create: {
            line1: input.addressLine1,
            city: input.city,
            state: input.state,
            postalCode: input.postalCode,
            country: input.country,
          }
        },

        items: {
          create: input.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            options: JSON.stringify({ size: item.size, variant: item.variant }),
          }))
        },

        payment: {
          create: {
            method: 'COD', // Defaulting to Cash on Delivery / Manual for V2 phase 2
            status: 'PENDING'
          }
        }
      }
    });

    return { success: true, orderId: order.id, orderNumber: order.orderNumber };
  } catch (error) {
    console.error('Checkout error:', error);
    return { success: false, error: 'Failed to process checkout.' };
  }
}
