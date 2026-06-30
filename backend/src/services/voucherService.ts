import { prisma } from "../lib/prisma";
import { CreateVoucherInput, CreatePromoInput } from "../validators/voucherValidator";
import { ApiError } from "../utils/ApiError";

export const voucherService = {
  // ── Vouchers ─────────────────────────────────────────────
getAllVouchers: async () => {
  return prisma.voucher.findMany({
    orderBy: { createdAt: "desc" },
  });
},
  getActiveVouchers: async () => {
  const allVouchers = await prisma.voucher.findMany({
    where: {
      isActive: true,
      AND: [
        {
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  // Filter out vouchers that hit their usage limit (can't compare two columns in Prisma directly)
  return allVouchers.filter(
    (v) => !v.usageLimit || v.usedCount < v.usageLimit
  );
},

  validateVoucher: async (code: string, orderAmount: number) => {
    const voucher = await prisma.voucher.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!voucher) throw ApiError.notFound("Voucher not found.");
    if (!voucher.isActive) throw ApiError.badRequest("This voucher is no longer active.");
    if (voucher.expiresAt && voucher.expiresAt < new Date()) {
      throw ApiError.badRequest("This voucher has expired.");
    }
    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      throw ApiError.badRequest("This voucher has reached its usage limit.");
    }
    if (voucher.minOrderAmount && orderAmount < Number(voucher.minOrderAmount)) {
      throw ApiError.badRequest(
        `Minimum order amount is Rp ${Number(voucher.minOrderAmount).toLocaleString("id-ID")}`
      );
    }

    // Calculate discount
    let discount = 0;
    if (voucher.type === "PERCENTAGE") {
      discount = Math.round(orderAmount * (Number(voucher.value) / 100));
      if (voucher.maxDiscount) {
        discount = Math.min(discount, Number(voucher.maxDiscount));
      }
    } else {
      discount = Number(voucher.value);
    }

    return { voucher, discount };
  },

  createVoucher: async (input: CreateVoucherInput) => {
    const existing = await prisma.voucher.findUnique({
      where: { code: input.code },
    });
    if (existing) throw ApiError.conflict("Voucher code already exists.");

    return prisma.voucher.create({
      data: {
        code: input.code,
        type: input.type,
        value: input.value,
        minOrderAmount: input.minOrderAmount,
        maxDiscount: input.maxDiscount,
        usageLimit: input.usageLimit,
        expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      },
    });
  },

  toggleVoucher: async (id: string) => {
    const voucher = await prisma.voucher.findUnique({ where: { id } });
    if (!voucher) throw ApiError.notFound("Voucher not found.");
    return prisma.voucher.update({
      where: { id },
      data: { isActive: !voucher.isActive },
    });
  },

  // ── Promos ────────────────────────────────────────────────

  getActivePromos: async () => {
    const now = new Date();
    return prisma.promo.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { startDate: "desc" },
    });
  },

  getAllPromos: async () => {
    return prisma.promo.findMany({ orderBy: { createdAt: "desc" } });
  },

  createPromo: async (input: CreatePromoInput) => {
    return prisma.promo.create({
      data: {
        title: input.title,
        description: input.description,
        type: input.type,
        value: input.value,
        bannerUrl: input.bannerUrl,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
      },
    });
  },

  togglePromo: async (id: string) => {
    const promo = await prisma.promo.findUnique({ where: { id } });
    if (!promo) throw ApiError.notFound("Promo not found.");
    return prisma.promo.update({
      where: { id },
      data: { isActive: !promo.isActive },
    });
  },
};