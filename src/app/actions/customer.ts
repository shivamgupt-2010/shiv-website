"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleWishlist(userId: string, productId: string) {
  try {
    const existing = await db.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      await db.wishlistItem.delete({
        where: { id: existing.id },
      });
      revalidatePath("/products");
      revalidatePath("/account");
      return { success: true, action: "removed" };
    } else {
      await db.wishlistItem.create({
        data: {
          userId,
          productId,
        },
      });
      revalidatePath("/products");
      revalidatePath("/account");
      return { success: true, action: "added" };
    }
  } catch (error: any) {
    console.error("Error toggling wishlist:", error);
    return { success: false, error: error.message };
  }
}
