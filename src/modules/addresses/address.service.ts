import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import type { User } from "@prisma/client";

type AddressInput = {
  type?: string;
  // Frontend uses `name`, DB uses `fullName`
  fullName?: string;
  name?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

type AddressUpdate = Partial<AddressInput>;

export const AddressService = {
  listForUser: async (user: User) => {
    return prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    });
  },

  getDefaultForUser: async (user: User) => {
    return prisma.address.findFirst({ where: { userId: user.id, isDefault: true } });
  },

  create: async (user: User, input: AddressInput) => {
    const count = await prisma.address.count({ where: { userId: user.id } });
    const shouldBeDefault = count === 0;

    return prisma.address.create({
      data: {
        type: input.type || "Home",
        fullName: input.fullName || input.name || "",
        phone: input.phone,
        address: input.address,
        city: input.city,
        state: input.state,
        zip: input.zip,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });
  },

  update: async (user: User, id: string, input: AddressUpdate) => {
    const found = await prisma.address.findFirst({ where: { id, userId: user.id } });
    if (!found) throw new ApiError(404, "Address not found");
    const data: any = { ...input };
    if (data.name && !data.fullName) {
      data.fullName = data.name;
    }
    delete data.name;
    return prisma.address.update({ where: { id }, data });
  },

  remove: async (user: User, id: string) => {
    const found = await prisma.address.findFirst({ where: { id, userId: user.id } });
    if (!found) throw new ApiError(404, "Address not found");

    const wasDefault = found.isDefault;
    await prisma.address.delete({ where: { id } });

    if (wasDefault) {
      const next = await prisma.address.findFirst({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
      });
      if (next) await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }

    return { success: true };
  },

  setDefault: async (user: User, id: string) => {
    const found = await prisma.address.findFirst({ where: { id, userId: user.id } });
    if (!found) throw new ApiError(404, "Address not found");

    await prisma.$transaction(async (tx) => {
      await tx.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
      await tx.address.update({ where: { id }, data: { isDefault: true } });
    });

    return prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    });
  },
};
