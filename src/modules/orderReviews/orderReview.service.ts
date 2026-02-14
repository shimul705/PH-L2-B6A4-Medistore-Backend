import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

export async function listOrderReviews(limit = 8) {
  return prisma.orderReview.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      customer: { select: { name: true, image: true } },
      order: { select: { id: true, status: true, createdAt: true } },
    },
  });
}

export async function getOrderReview(orderId: string, customerId: string) {
  return prisma.orderReview.findFirst({ where: { orderId, customerId } });
}

export async function createOrderReview(orderId: string, customerId: string, text: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) throw new ApiError(404, "Order not found");
  if (order.customerId !== customerId) throw new ApiError(403, "Forbidden");
  if (!(order.status === "DELIVERED" || order.status === "CANCELLED")) {
    throw new ApiError(400, "Order must be delivered or cancelled");
  }

  try {
    return await prisma.orderReview.create({
      data: { orderId, customerId, text },
    });
  } catch (_e) {
    throw new ApiError(400, "Review already submitted");
  }
}
