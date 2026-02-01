import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

export const CategoryService = {
  getAll: () => prisma.category.findMany({ orderBy: { createdAt: "desc" } }),

  create: (payload: { name: string }) => prisma.category.create({ data: payload }),

  update: async (id: string, payload: { name?: string }) => {
    const exists = await prisma.category.findUnique({ where: { id } });
    if (!exists) throw new ApiError(404, "Category not found");
    return prisma.category.update({ where: { id }, data: payload });
  },

  remove: async (id: string) => {
    const exists = await prisma.category.findUnique({ where: { id } });
    if (!exists) throw new ApiError(404, "Category not found");
    await prisma.category.delete({ where: { id } });
  },
};
