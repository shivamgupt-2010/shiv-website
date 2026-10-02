'use server';

import db from '@/lib/db';

export async function submitContactForm(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const projectType = formData.get('subject') as string;
  const message = formData.get('message') as string;

  try {
    await db.businessLead.create({
      data: {
        name,
        email,
        projectType,
        message,
        status: 'NEW'
      }
    });
    return { success: true };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: 'Failed to submit form' };
  }
}
