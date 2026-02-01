// import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import type { AppUser } from "../../middlewares/authGuard";
import { Prisma } from "../../generated/prisma/client";

export const MedicineService = {
  getAll: async (query: any) => {
    const search = query.search ? String(query.search) : undefined;
    const categoryId = query.categoryId ? String(query.categoryId) : undefined;
    const manufacturer = query.manufacturer ? String(query.manufacturer) : undefined;
    const minPrice = query.minPrice ? Number(query.minPrice) : undefined;
    const maxPrice = query.maxPrice ? Number(query.maxPrice) : undefined;

    return prisma.medicine.findMany({
      where: {
        isActive: true,
        ...(search
          ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
          : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(manufacturer ? { manufacturer: { contains: manufacturer, mode: "insensitive" } } : {}),
        ...(minPrice !== undefined || maxPrice !== undefined
          ? { price: { gte: minPrice ?? undefined, lte: maxPrice ?? undefined } }
          : {}),
      },
      include: { category: true, seller: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  getById: async (id: string) => {
    const medicine = await prisma.medicine.findUnique({
      where: { id },
      include: { category: true, seller: { select: { id: true, name: true, email: true } }, reviews: true },
    });
    if (!medicine) throw new ApiError(404, "Medicine not found");
    if (!medicine.isActive) throw new ApiError(404, "Medicine not found");
    return medicine;
  },

  create: async (user: AppUser, payload: any) => {
    return prisma.medicine.create({
      data: {
        name: payload.name,
        description: payload.description,
        price: new Prisma.Decimal(payload.price),
        stock: payload.stock,
        manufacturer: payload.manufacturer,
        imageUrl: payload.imageUrl,
        categoryId: payload.categoryId,
        sellerId: user.id,
      },
    });
  },

  update: async (user: AppUser, id: string, payload: any) => {
    const medicine = await prisma.medicine.findUnique({ where: { id } });
    if (!medicine) throw new ApiError(404, "Medicine not found");

    if (user.role === "SELLER" && medicine.sellerId !== user.id) {
      throw new ApiError(403, "Forbidden");
    }

    return prisma.medicine.update({
      where: { id },
      data: {
        ...(payload.name !== undefined ? { name: payload.name } : {}),
        ...(payload.description !== undefined ? { description: payload.description } : {}),
        ...(payload.price !== undefined ? { price: new Prisma.Decimal(payload.price) } : {}),
        ...(payload.stock !== undefined ? { stock: payload.stock } : {}),
        ...(payload.manufacturer !== undefined ? { manufacturer: payload.manufacturer } : {}),
        ...(payload.imageUrl !== undefined ? { imageUrl: payload.imageUrl } : {}),
        ...(payload.categoryId !== undefined ? { categoryId: payload.categoryId } : {}),
        ...(payload.isActive !== undefined ? { isActive: payload.isActive } : {}),
      },
    });
  },

  remove: async (user: AppUser, id: string) => {
    const medicine = await prisma.medicine.findUnique({ where: { id } });
    if (!medicine) throw new ApiError(404, "Medicine not found");

    if (user.role === "SELLER" && medicine.sellerId !== user.id) {
      throw new ApiError(403, "Forbidden");
    }

    await prisma.medicine.delete({ where: { id } });
  },
};
