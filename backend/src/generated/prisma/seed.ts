import { PrismaClient } from ".";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...\n");

  // ── Categories ─────────────────────────────────────────

  console.log("📦 Seeding categories...");
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: { name: "Electronics", slug: "electronics", iconUrl: "📱" },
    }),
    prisma.category.upsert({
      where: { slug: "fashion" },
      update: {},
      create: { name: "Fashion", slug: "fashion", iconUrl: "👕" },
    }),
    prisma.category.upsert({
      where: { slug: "food-beverage" },
      update: {},
      create: {
        name: "Food & Beverage",
        slug: "food-beverage",
        iconUrl: "🍜",
      },
    }),
    prisma.category.upsert({
      where: { slug: "books" },
      update: {},
      create: { name: "Books", slug: "books", iconUrl: "📚" },
    }),
    prisma.category.upsert({
      where: { slug: "sports" },
      update: {},
      create: { name: "Sports", slug: "sports", iconUrl: "⚽" },
    }),
    prisma.category.upsert({
      where: { slug: "beauty" },
      update: {},
      create: { name: "Beauty", slug: "beauty", iconUrl: "💄" },
    }),
    prisma.category.upsert({
      where: { slug: "home-living" },
      update: {},
      create: {
        name: "Home & Living",
        slug: "home-living",
        iconUrl: "🏠",
      },
    }),
    prisma.category.upsert({
      where: { slug: "toys" },
      update: {},
      create: { name: "Toys", slug: "toys", iconUrl: "🧸" },
    }),
  ]);
  console.log(`   ✅ ${categories.length} categories seeded\n`);

  // ── Demo Accounts ──────────────────────────────────────

  console.log("👤 Seeding demo accounts...");
  const hashedPassword = await bcrypt.hash("Password123", 12);

  // Admin account
  const admin = await prisma.user.upsert({
    where: { email: "admin@seapedia.com" },
    update: {},
    create: {
      email: "admin@seapedia.com",
      password: hashedPassword,
      name: "Admin SEAPEDIA",
      phone: "08100000001",
      roles: {
        create: [
          { role: "ADMIN", isActive: true },
          { role: "BUYER", isActive: false },
        ],
      },
      wallet: { create: { balance: 0 } },
    },
  });

  // Buyer account
  const buyer = await prisma.user.upsert({
    where: { email: "buyer@seapedia.com" },
    update: {},
    create: {
      email: "buyer@seapedia.com",
      password: hashedPassword,
      name: "Budi Santoso",
      phone: "08100000002",
      roles: {
        create: [{ role: "BUYER", isActive: true }],
      },
      wallet: { create: { balance: 500000 } },
      addresses: {
        create: {
          label: "Home",
          recipientName: "Budi Santoso",
          phone: "08100000002",
          street: "Jl. Sudirman No. 123",
          city: "Jakarta Pusat",
          province: "DKI Jakarta",
          postalCode: "10220",
          isDefault: true,
        },
      },
    },
  });

  // Seller account
  const seller = await prisma.user.upsert({
    where: { email: "seller@seapedia.com" },
    update: {},
    create: {
      email: "seller@seapedia.com",
      password: hashedPassword,
      name: "Siti Rahayu",
      phone: "08100000003",
      roles: {
        create: [
          { role: "SELLER", isActive: true },
          { role: "BUYER", isActive: false },
        ],
      },
      wallet: { create: { balance: 250000 } },
    },
  });

  // Driver account
  const driver = await prisma.user.upsert({
    where: { email: "driver@seapedia.com" },
    update: {},
    create: {
      email: "driver@seapedia.com",
      password: hashedPassword,
      name: "Joko Widodo",
      phone: "08100000004",
      roles: {
        create: [
          { role: "DRIVER", isActive: true },
          { role: "BUYER", isActive: false },
        ],
      },
      wallet: { create: { balance: 150000 } },
    },
  });

  console.log("   ✅ Demo accounts created:");
  console.log("      👑 Admin   → admin@seapedia.com  / Password123");
  console.log("      🛍️  Buyer   → buyer@seapedia.com  / Password123");
  console.log("      🏪 Seller  → seller@seapedia.com / Password123");
  console.log("      🚚 Driver  → driver@seapedia.com / Password123\n");

  // ── Store ──────────────────────────────────────────────

  console.log("🏪 Seeding demo store...");
  const store = await prisma.store.upsert({
    where: { slug: "siti-electronics" },
    update: {},
    create: {
      userId: seller.id,
      name: "Siti Electronics",
      slug: "siti-electronics",
      description:
        "Toko elektronik terpercaya dengan produk berkualitas tinggi.",
      logoUrl: "https://picsum.photos/seed/store1/100/100",
      bannerUrl: "https://picsum.photos/seed/banner1/800/200",
    },
  });
  console.log("   ✅ Store: Siti Electronics\n");

  // ── Products ───────────────────────────────────────────

  console.log("📱 Seeding demo products...");

  const electronics = categories.find((c) => c.slug === "electronics")!;
  const fashion = categories.find((c) => c.slug === "fashion")!;
  const food = categories.find((c) => c.slug === "food-beverage")!;

  const products = [
    {
      name: "Wireless Earbuds Pro",
      slug: "wireless-earbuds-pro",
      description:
        "Premium wireless earbuds dengan noise cancellation aktif, battery 8 jam, dan case charging 24 jam. Kompatibel dengan iOS dan Android.",
      price: 299000,
      stock: 50,
      weight: 150,
      categoryId: electronics.id,
      images: [
        {
          url: "https://picsum.photos/seed/earbuds1/400/400",
          isPrimary: true,
          order: 0,
        },
        {
          url: "https://picsum.photos/seed/earbuds2/400/400",
          isPrimary: false,
          order: 1,
        },
      ],
    },
    {
      name: "Smartphone Stand Adjustable",
      slug: "smartphone-stand-adjustable",
      description:
        "Stand HP yang bisa diatur sudutnya, kompatibel dengan semua smartphone. Material aluminium premium anti-gores.",
      price: 89000,
      stock: 100,
      weight: 300,
      categoryId: electronics.id,
      images: [
        {
          url: "https://picsum.photos/seed/stand1/400/400",
          isPrimary: true,
          order: 0,
        },
      ],
    },
    {
      name: "USB-C Hub 7 in 1",
      slug: "usbc-hub-7-in-1",
      description:
        "Hub USB-C dengan 7 port: HDMI 4K, USB 3.0 x3, SD card, microSD, dan PD charging 100W.",
      price: 349000,
      stock: 30,
      weight: 200,
      categoryId: electronics.id,
      images: [
        {
          url: "https://picsum.photos/seed/hub1/400/400",
          isPrimary: true,
          order: 0,
        },
        {
          url: "https://picsum.photos/seed/hub2/400/400",
          isPrimary: false,
          order: 1,
        },
      ],
    },
    {
      name: "Kaos Polos Premium Cotton",
      slug: "kaos-polos-premium-cotton",
      description:
        "Kaos polos bahan combed 30s, tersedia dalam 12 warna. Nyaman dipakai sehari-hari.",
      price: 75000,
      stock: 200,
      weight: 250,
      categoryId: fashion.id,
      images: [
        {
          url: "https://picsum.photos/seed/kaos1/400/400",
          isPrimary: true,
          order: 0,
        },
      ],
    },
    {
      name: "Mechanical Keyboard TKL",
      slug: "mechanical-keyboard-tkl",
      description:
        "Keyboard mechanical TKL dengan switch brown, backlight RGB, dan build quality aluminium. Cocok untuk gaming dan kerja.",
      price: 799000,
      stock: 15,
      weight: 800,
      categoryId: electronics.id,
      images: [
        {
          url: "https://picsum.photos/seed/keyboard1/400/400",
          isPrimary: true,
          order: 0,
        },
        {
          url: "https://picsum.photos/seed/keyboard2/400/400",
          isPrimary: false,
          order: 1,
        },
      ],
    },
  ];

  for (const p of products) {
    const existing = await prisma.product.findUnique({
      where: { storeId_slug: { storeId: store.id, slug: p.slug } },
    });

    if (!existing) {
      await prisma.product.create({
        data: {
          storeId: store.id,
          categoryId: p.categoryId,
          name: p.name,
          slug: p.slug,
          description: p.description,
          price: p.price,
          stock: p.stock,
          weight: p.weight,
          images: { create: p.images },
        },
      });
    }
  }
  console.log(`   ✅ ${products.length} products seeded\n`);

  // ── Vouchers ───────────────────────────────────────────

  console.log("🎫 Seeding demo vouchers...");
  await prisma.voucher.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: "PERCENTAGE",
      value: 10,
      minOrderAmount: 50000,
      maxDiscount: 25000,
      usageLimit: 100,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  await prisma.voucher.upsert({
    where: { code: "FLAT20K" },
    update: {},
    create: {
      code: "FLAT20K",
      type: "FIXED",
      value: 20000,
      minOrderAmount: 100000,
      usageLimit: 50,
    },
  });

  await prisma.voucher.upsert({
    where: { code: "COMPFEST18" },
    update: {},
    create: {
      code: "COMPFEST18",
      type: "PERCENTAGE",
      value: 18,
      maxDiscount: 50000,
      usageLimit: 200,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  console.log("   ✅ Vouchers: WELCOME10, FLAT20K, COMPFEST18\n");

  // ── Promo ──────────────────────────────────────────────

  console.log("🎉 Seeding demo promo...");
  const existingPromo = await prisma.promo.findFirst({
    where: { title: "COMPFEST 18 Grand Sale" },
  });

  if (!existingPromo) {
    await prisma.promo.create({
      data: {
        title: "COMPFEST 18 Grand Sale",
        description: "Diskon besar-besaran untuk merayakan COMPFEST 18!",
        type: "PERCENTAGE",
        value: 18,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    });
  }
  console.log("   ✅ Promo: COMPFEST 18 Grand Sale\n");

  // ── Reviews ────────────────────────────────────────────

  console.log("⭐ Seeding demo reviews...");
  const firstProduct = await prisma.product.findFirst({
    where: { storeId: store.id },
  });

  if (firstProduct) {
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId: buyer.id,
          productId: firstProduct.id,
        },
      },
    });

    if (!existingReview) {
      await prisma.review.create({
        data: {
          userId: buyer.id,
          productId: firstProduct.id,
          rating: 5,
          comment:
            "Produk sangat bagus, pengiriman cepat! Recommended seller.",
        },
      });
    }
  }
  console.log("   ✅ Sample review added\n");

  // ── Summary ────────────────────────────────────────────

  console.log("═══════════════════════════════════════");
  console.log("✅ SEED COMPLETE — SEAPEDIA is ready!");
  console.log("═══════════════════════════════════════\n");
  console.log("Demo Accounts (all passwords: Password123):");
  console.log("  👑 Admin  : admin@seapedia.com");
  console.log("  🛍️  Buyer  : buyer@seapedia.com  (wallet: Rp 500.000)");
  console.log("  🏪 Seller : seller@seapedia.com  (wallet: Rp 250.000)");
  console.log("  🚚 Driver : driver@seapedia.com  (wallet: Rp 150.000)");
  console.log("\nVoucher Codes:");
  console.log("  🎫 WELCOME10  — 10% off (min Rp 50.000, max Rp 25.000)");
  console.log("  🎫 FLAT20K    — Rp 20.000 off (min Rp 100.000)");
  console.log("  🎫 COMPFEST18 — 18% off (max Rp 50.000, 7 days)");
  console.log("\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());