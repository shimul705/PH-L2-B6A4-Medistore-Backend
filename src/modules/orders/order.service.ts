import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import type { AppUser } from "../../middlewares/authGuard";

type CreateOrderItem = { medicineId: string; quantity: number };

export const OrderService = {
  create: async (user: AppUser, payload: any) => {
    if (user.role !== "CUSTOMER") throw new ApiError(403, "Only customers can place orders");

    const items: CreateOrderItem[] = payload.items;
    const medicineIds = items.map((i) => i.medicineId);

    return prisma.$transaction(async (tx) => {
      const medicines = await tx.medicine.findMany({ where: { id: { in: medicineIds }, isActive: true } });

      if (medicines.length !== medicineIds.length) {
        throw new ApiError(400, "One or more medicines are invalid");
      }

      // Validate stock & compute total
      let total = new Prisma.Decimal(0);

      for (const it of items) {
        const med = medicines.find((m) => m.id === it.medicineId)!;
        if (med.stock < it.quantity) throw new ApiError(400, `Not enough stock for ${med.name}`);
        total = total.add(med.price.mul(it.quantity));
      }

      // Create order + items
      const order = await tx.order.create({
        data: {
          customerId: user.id,
          shippingName: payload.shippingName,
          shippingPhone: payload.shippingPhone,
          shippingAddress: payload.shippingAddress,
          shippingCity: payload.shippingCity,
          shippingArea: payload.shippingArea,
          notes: payload.notes,
          total,
          items: {
            create: items.map((it) => {
              const med = medicines.find((m) => m.id === it.medicineId)!;
              return {
                medicineId: med.id,
                sellerId: med.sellerId,
                quantity: it.quantity,
                unitPrice: med.price,
              };
            }),
          },
        },
        include: { items: true },
      });

      // Decrement stock
      for (const it of items) {
        await tx.medicine.update({
          where: { id: it.medicineId },
          data: { stock: { decrement: it.quantity } },
        });
      }

      return order;
    });
  },

  getMyOrders: async (user: AppUser) => {
    if (user.role === "CUSTOMER") {
      return prisma.order.findMany({
        where: { customerId: user.id },
        include: { items: { include: { medicine: true } } },
        orderBy: { createdAt: "desc" },
      });
    }

    if (user.role === "SELLER") {
      return prisma.order.findMany({
        where: { items: { some: { sellerId: user.id } } },
        include: { items: { where: { sellerId: user.id }, include: { medicine: true } }, customer: true },
        orderBy: { createdAt: "desc" },
      });
    }

    // ADMIN
    return prisma.order.findMany({
      include: { items: { include: { medicine: true } }, customer: true },
      orderBy: { createdAt: "desc" },
    });
  },

  getById: async (user: AppUser, id: string) => {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { medicine: true } }, customer: true },
    });
    if (!order) throw new ApiError(404, "Order not found");

    if (user.role === "CUSTOMER" && order.customerId !== user.id) throw new ApiError(403, "Forbidden");
    if (user.role === "SELLER") {
      const owns = order.items.some((i) => i.sellerId === user.id);
      if (!owns) throw new ApiError(403, "Forbidden");
    }

    return order;
  },

  updateStatus: async (user: AppUser, id: string, status: any) => {
    const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
    if (!order) throw new ApiError(404, "Order not found");

    if (user.role === "CUSTOMER") throw new ApiError(403, "Customers cannot update order status");
    if (user.role === "SELLER" && !order.items.some((i) => i.sellerId === user.id)) {
      throw new ApiError(403, "Forbidden");
    }

    return prisma.order.update({ where: { id }, data: { status } });
  },
};
