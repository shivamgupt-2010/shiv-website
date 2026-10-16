'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export interface SelectedServicePayload {
  id: string;
  title: string;
  categoryName: string;
  price: number;
  billingType: 'ONE_TIME' | 'MONTHLY';
  quantity: number;
  subtotal: number;
}

export interface QuotationSubmissionData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName?: string;
  timeline?: string;
  projectNotes?: string;
  selectedServices: SelectedServicePayload[];
  selectedAddons: { id: string; title: string; price: number }[];
  oneTimeTotal: number;
  monthlyTotal: number;
  exclusionsConfirmed: boolean;
}

export async function submitServiceQuotation(payload: QuotationSubmissionData) {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      companyName,
      timeline,
      projectNotes,
      selectedServices,
      selectedAddons,
      oneTimeTotal,
      monthlyTotal,
    } = payload;

    if (!customerName || !customerEmail || !customerPhone) {
      return { success: false, error: 'Name, email, and WhatsApp phone number are required.' };
    }

    if (!selectedServices || selectedServices.length === 0) {
      return { success: false, error: 'Please select at least one service to request a quote.' };
    }

    // Compose rich human-readable message for the lead record
    const oneTimeItems = selectedServices.filter((s) => s.billingType === 'ONE_TIME');
    const monthlyItems = selectedServices.filter((s) => s.billingType === 'MONTHLY');

    let formattedMessage = `REQUESTED QUOTATION BREAKDOWN:\n\n`;

    if (oneTimeItems.length > 0) {
      formattedMessage += `--- ONE-TIME SERVICES ---\n`;
      oneTimeItems.forEach((s) => {
        formattedMessage += `• ${s.title} (Qty: ${s.quantity}) — ₹${s.subtotal.toLocaleString('en-IN')}\n`;
      });
      if (selectedAddons.length > 0) {
        formattedMessage += `\n--- ADD-ONS ---\n`;
        selectedAddons.forEach((a) => {
          formattedMessage += `• ${a.title} — ₹${a.price.toLocaleString('en-IN')}\n`;
        });
      }
      formattedMessage += `One-Time Investment Total: ₹${oneTimeTotal.toLocaleString('en-IN')}\n\n`;
    }

    if (monthlyItems.length > 0) {
      formattedMessage += `--- MONTHLY RETAINERS ---\n`;
      monthlyItems.forEach((s) => {
        formattedMessage += `• ${s.title} (Qty: ${s.quantity}) — ₹${s.subtotal.toLocaleString('en-IN')}/month\n`;
      });
      formattedMessage += `Monthly Recurring Total: ₹${monthlyTotal.toLocaleString('en-IN')}/month\n\n`;
    }

    formattedMessage += `--- CLIENT DETAILS & TIMELINE ---\n`;
    formattedMessage += `Timeline: ${timeline || 'Flexible / Discussion'}\n`;
    if (projectNotes) {
      formattedMessage += `Project Brief & Notes: ${projectNotes}\n`;
    }

    // Save structured payload in notes for the admin dashboard CRM
    const structuredNotes = JSON.stringify({
      oneTimeTotal,
      monthlyTotal,
      selectedServices,
      selectedAddons,
      timeline,
      projectNotes,
      exclusionsConfirmed: payload.exclusionsConfirmed,
      submittedAt: new Date().toISOString(),
    });

    const lead = await db.businessLead.create({
      data: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        company: companyName || null,
        projectType: `Services Quote (${selectedServices.length} items)`,
        message: formattedMessage,
        notes: structuredNotes,
        quotation: oneTimeTotal,
        projectValue: oneTimeTotal + monthlyTotal * 3,
        status: 'NEW',
      },
    });

    revalidatePath('/admin/business-leads');

    // Build pre-filled WhatsApp message URL
    let waText = `Hi SHIV, I just submitted a services quotation request on your website!\n\n`;
    waText += `*Name:* ${customerName}\n`;
    if (companyName) waText += `*Business:* ${companyName}\n`;
    waText += `*One-Time Services Total:* ₹${oneTimeTotal.toLocaleString('en-IN')}\n`;
    if (monthlyTotal > 0) {
      waText += `*Monthly Retainer:* ₹${monthlyTotal.toLocaleString('en-IN')}/month\n`;
    }
    waText += `*Items Selected:* ${selectedServices.length} services\n`;
    waText += `*Lead Reference ID:* #${lead.id.slice(-6).toUpperCase()}`;

    const waUrl = `https://wa.me/91626686575?text=${encodeURIComponent(waText)}`;

    return {
      success: true,
      leadId: lead.id,
      waUrl,
    };
  } catch (error: any) {
    console.error('Error submitting service quotation:', error);
    return { success: false, error: error.message || 'Failed to submit quotation. Please try again.' };
  }
}
