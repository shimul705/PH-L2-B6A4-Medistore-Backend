import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

export const AdminService = {
  getUsers: () => prisma.user.findMany({ orderBy: { createdAt: "desc" } }),

  updateUserStatus: async (id: string, isBanned: boolean) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new ApiError(404, "User not found");
    return prisma.user.update({ where: { id }, data: { isBanned } });
  },

  getAllMedicines: () =>
    prisma.medicine.findMany({ include: { category: true, seller: true }, orderBy: { createdAt: "desc" } }),

  getAllOrders: () =>
    prisma.order.findMany({ include: { items: { include: { medicine: true } }, customer: true }, orderBy: { createdAt: "desc" } }),
};
