import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import type { AppUser } from "../../middlewares/authGuard";

export const ReviewService = {
  getForMedicine: async (medicineId: string) => {
    return prisma.review.findMany({
      where: { medicineId },
      include: { customer: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  create: async (user: AppUser, payload: any) => {
    if (user.role !== "CUSTOMER") throw new ApiError(403, "Only customers can review");

    // We keep `Order.items` as JSON (no separate OrderItem table). To verify purchase,
    // we load the customer's orders and check for the medicineId in stored items.
    const orders = await prisma.order.findMany({
      where: { customerId: user.id },
      select: { items: true },
    });

    const purchased = orders.some((o) => {
      const items = Array.isArray(o.items) ? (o.items as any[]) : [];
      return items.some((i) => i?.medicineId === payload.medicineId);
    });

    if (!purchased) throw new ApiError(400, "You can only review medicines you ordered");

    try {
      return await prisma.review.create({
        data: {
          rating: payload.rating,
          comment: payload.comment,
          customerId: user.id,
          medicineId: payload.medicineId,
        },
      });
    } catch (e: any) {
      // Unique constraint (one review per medicine)
      throw new ApiError(400, "You already reviewed this medicine");
    }
  },
};
