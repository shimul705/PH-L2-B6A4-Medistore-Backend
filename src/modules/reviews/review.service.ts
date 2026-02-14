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


  getFeed: async (limit = 10) => {
    return prisma.review.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { id: true, name: true } },
        medicine: { select: { id: true, name: true, imageUrl: true } },
      },
    });
  },

  createFromOrder: async (user: AppUser, orderId: string, payload: any) => {
    if (user.role !== "CUSTOMER") throw new ApiError(403, "Only customers can review");
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new ApiError(404, "Order not found");
    if (order.customerId !== user.id) throw new ApiError(403, "Not your order");

    if (order.status !== "DELIVERED" && order.status !== "CANCELLED") {
      throw new ApiError(400, "Order must be DELIVERED or CANCELLED to review");
    }

    const items = Array.isArray(order.items) ? (order.items as any[]) : [];
    if (items.length === 0) throw new ApiError(400, "Order has no items");

    const prefix =
      order.status === "DELIVERED" ? "I received my order, " : "My order is canceled, ";
    const rawText = String(
      payload.comment ?? payload.review ?? payload.reviewText ?? payload.text ?? ""
    ).trim();
    if (!rawText) throw new ApiError(400, "Review comment is required");
    const comment = `${prefix}${rawText}`.trim();

    // Create review per medicine in this order (skip already reviewed)
    const created: any[] = [];
    for (const it of items) {
      const medicineId = it?.medicineId;
      if (!medicineId) continue;
      try {
        const r = await prisma.review.create({
          data: {
            rating: Number(payload.rating || 5),
            comment,
            customerId: user.id,
            medicineId,
          },
        });
        created.push(r);
      } catch (e: any) {
        // ignore duplicates (one review per medicine per customer)
      }
    }
    return created;
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
