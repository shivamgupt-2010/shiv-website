"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createReview(formData: FormData) {
  try {
    const customerName = formData.get("customerName") as string;
    const company = formData.get("company") as string;
    const review = formData.get("review") as string;
    const rating = parseInt(formData.get("rating") as string) || 5;
    const productProject = formData.get("productProject") as string;
    const image = formData.get("image") as string;
    const featured = formData.get("featured") === "on";

    if (!customerName || !review) {
      return { success: false, error: "Name and Review text are required" };
    }

    await db.review.create({
      data: {
        customerName,
        company,
        review,
        rating,
        productProject,
        image,
        featured,
      },
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create review:", error);
    return { success: false, error: error.message };
  }
}

export async function updateReview(id: string, formData: FormData) {
  try {
    const customerName = formData.get("customerName") as string;
    const company = formData.get("company") as string;
    const review = formData.get("review") as string;
    const rating = parseInt(formData.get("rating") as string) || 5;
    const productProject = formData.get("productProject") as string;
    const image = formData.get("image") as string;
    const featured = formData.get("featured") === "on";

    await db.review.update({
      where: { id },
      data: {
        customerName,
        company,
        review,
        rating,
        productProject,
        image,
        featured,
      },
    });

    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update review:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteReview(id: string) {
  try {
    await db.review.delete({ where: { id } });
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete review:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleReviewVisibility(id: string, hidden: boolean) {
  try {
    await db.review.update({
      where: { id },
      data: { hidden },
    });
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
