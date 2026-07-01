import { orderRepository } from "../repositories/orderRepository";
import { walletRepository } from "../repositories/walletRepository";
import { cartRepository } from "../repositories/cartRepository";
import { CreateOrderInput, calculateDeliveryFee, PPN_RATE } from "../validators/orderValidator";
import { ApiError } from "../utils/ApiError";
import { prisma } from "../lib/prisma";
import { WalletTransactionType } from "../generated/prisma";

export const orderService = {
  createOrder: async (userId: string, input: CreateOrderInput) => {
    // 1. Validate address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: input.addressId, userId },
    });
    if (!address) throw ApiError.notFound("Address not found.");

    // 2. Validate store exists
    const store = await prisma.store.findUnique({
      where: { id: input.storeId },
    });
    if (!store || !store.isActive) {
      throw ApiError.notFound("Store not found.");
    }

    // 3. Validate all products and build order items
    let subtotal = 0;
    let totalWeightGrams = 0;
    const orderItems = [];

    for (const item of input.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { images: { where: { isPrimary: true }, take: 1 } },
      });

      if (!product || !product.isActive) {
        throw ApiError.badRequest(`Product not found: ${item.productId}`);
      }
      if (product.storeId !== input.storeId) {
        throw ApiError.badRequest(
          "All items must be from the same store."
        );
      }
      if (product.stock < item.quantity) {
        throw ApiError.badRequest(
          `Insufficient stock for "${product.name}". Available: ${product.stock}`
        );
      }

      const itemSubtotal = Number(product.price) * item.quantity;
      subtotal += itemSubtotal;
      totalWeightGrams += Number(product.weight) * item.quantity;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productImg: product.images[0]?.url,
        price: Number(product.price),
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }

    // 4. Calculate fees (delivery fee depends on chosen delivery method)
    const deliveryFee = calculateDeliveryFee(totalWeightGrams, input.deliveryMethod);
    const taxAmount = Math.round(subtotal * PPN_RATE);

    // 5. Apply voucher discount if provided
    let discountAmount = 0;
    if (input.voucherId) {
      const voucher = await prisma.voucher.findUnique({
        where: { id: input.voucherId },
      });
      if (!voucher || !voucher.isActive) {
        throw ApiError.badRequest("Invalid or expired voucher.");
      }
      if (voucher.expiresAt && voucher.expiresAt < new Date()) {
        throw ApiError.badRequest("This voucher has expired.");
      }
      if (voucher.minOrderAmount && subtotal < Number(voucher.minOrderAmount)) {
        throw ApiError.badRequest(
          `Minimum order for this voucher is Rp ${Number(voucher.minOrderAmount).toLocaleString("id-ID")}`
        );
      }
      if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
        throw ApiError.badRequest("This voucher has reached its usage limit.");
      }

      if (voucher.type === "PERCENTAGE") {
        discountAmount = Math.round(subtotal * (Number(voucher.value) / 100));
        if (voucher.maxDiscount) {
          discountAmount = Math.min(discountAmount, Number(voucher.maxDiscount));
        }
      } else {
        discountAmount = Number(voucher.value);
      }

      // Increment voucher usage count
      await prisma.voucher.update({
        where: { id: voucher.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    const totalAmount = subtotal + deliveryFee + taxAmount - discountAmount;

    // 6. Check wallet balance
    const wallet = await walletRepository.findByUserId(userId);
    if (!wallet) throw ApiError.notFound("Wallet not found.");
    if (Number(wallet.balance) < totalAmount) {
      throw ApiError.badRequest(
        `Insufficient wallet balance. Need Rp ${totalAmount.toLocaleString("id-ID")}, have Rp ${Number(wallet.balance).toLocaleString("id-ID")}.`
      );
    }

    // 7. Create the order (stock reduction happens inside)
    const order = await orderRepository.create({
      buyerId: userId,
      storeId: input.storeId,
      addressId: input.addressId,
      deliveryMethod: input.deliveryMethod,
      items: orderItems,
      subtotal,
      deliveryFee,
      taxAmount,
      discountAmount,
      totalAmount,
      voucherId: input.voucherId,
      notes: input.notes,
    });

    if (!order) throw ApiError.internal("Failed to create order.");

    // 8. Deduct wallet balance
    await walletRepository.deduct(
      wallet.id,
      totalAmount,
      Number(wallet.balance),
      `Payment for order #${order.id.slice(0, 8).toUpperCase()}`,
      order.id
    );

    // 9. Clear purchased items from cart
    await cartRepository.clearCart(userId);

    // 10. Create notification for buyer
    await prisma.notification.create({
      data: {
        userId,
        title: "Order Placed Successfully!",
        message: `Your order #${order.id.slice(0, 8).toUpperCase()} has been placed. Total: Rp ${totalAmount.toLocaleString("id-ID")}`,
        link: `/orders/${order.id}`,
      },
    });

    return order;
  },

  getMyOrders: async (userId: string, page = 1, limit = 10) => {
    return orderRepository.findByBuyer(userId, page, limit);
  },

  getOrderDetail: async (userId: string, orderId: string) => {
    const order = await orderRepository.findById(orderId);
    if (!order) throw ApiError.notFound("Order not found.");

    // Allow buyer or seller to view
    const store = await prisma.store.findUnique({
      where: { userId },
    });
    const isBuyer = order.buyerId === userId;
    const isSeller = store && order.storeId === store.id;

    if (!isBuyer && !isSeller) {
      throw ApiError.forbidden("You do not have access to this order.");
    }

    return order;
  },

  cancelOrder: async (userId: string, orderId: string) => {
    const order = await orderRepository.findById(orderId);
    if (!order) throw ApiError.notFound("Order not found.");
    if (order.buyerId !== userId) throw ApiError.forbidden("Not your order.");

    if (!["PENDING_PAYMENT", "PAID"].includes(order.status)) {
      throw ApiError.badRequest(
        "Order cannot be cancelled at this stage."
      );
    }

    // Refund wallet
    const wallet = await walletRepository.findByUserId(userId);
    if (wallet) {
      await walletRepository.credit(
        wallet.id,
        Number(order.totalAmount),
        Number(wallet.balance),
        WalletTransactionType.REFUND,
        `Refund for cancelled order #${order.id.slice(0, 8).toUpperCase()}`,
        order.id
      );
    }

    // Restore stock
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    return orderRepository.updateStatus(
      orderId,
      "CANCELLED",
      "Cancelled by buyer, refunded to wallet."
    );
  },

  // Buyer confirms the order was received, closing the main lifecycle
  // (DELIVERED -> COMPLETED / "Pesanan Selesai").
  confirmReceipt: async (userId: string, orderId: string) => {
    const order = await orderRepository.findById(orderId);
    if (!order) throw ApiError.notFound("Order not found.");
    if (order.buyerId !== userId) throw ApiError.forbidden("Not your order.");

    if (order.status !== "DELIVERED") {
      throw ApiError.badRequest(
        "Order must be DELIVERED before it can be marked as completed."
      );
    }

    return orderRepository.updateStatus(
      orderId,
      "COMPLETED",
      "Buyer confirmed receipt of the order."
    );
  },

  // Seller actions
  getSellerOrders: async (userId: string, page = 1, limit = 10) => {
    return orderRepository.findBySeller(userId, page, limit);
  },

  processOrder: async (userId: string, orderId: string) => {
    const order = await orderRepository.findById(orderId);
    if (!order) throw ApiError.notFound("Order not found.");

    const store = await prisma.store.findUnique({ where: { userId } });
    if (!store || order.storeId !== store.id) {
      throw ApiError.forbidden("Not your order.");
    }

    if (order.status !== "PAID") {
      throw ApiError.badRequest("Order must be PAID before processing.");
    }

    return orderRepository.updateStatus(
      orderId,
      "PROCESSING",
      "Seller started processing the order."
    );
  },

  markReadyForPickup: async (userId: string, orderId: string) => {
    const order = await orderRepository.findById(orderId);
    if (!order) throw ApiError.notFound("Order not found.");

    const store = await prisma.store.findUnique({ where: { userId } });
    if (!store || order.storeId !== store.id) {
      throw ApiError.forbidden("Not your order.");
    }

    if (order.status !== "PROCESSING") {
      throw ApiError.badRequest("Order must be PROCESSING first.");
    }

    return orderRepository.updateStatus(
      orderId,
      "READY_FOR_PICKUP",
      "Seller packed the order, waiting for driver."
    );
  },
};