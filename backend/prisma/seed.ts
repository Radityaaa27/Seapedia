import { prisma } from "../src/lib/prisma";

const categories = [
  { name: "Electronics", slug: "electronics", iconUrl: "📱" },
  { name: "Fashion", slug: "fashion", iconUrl: "👕" },
  { name: "Food & Beverage", slug: "food-beverage", iconUrl: "🍜" },
  { name: "Books", slug: "books", iconUrl: "📚" },
  { name: "Sports", slug: "sports", iconUrl: "⚽" },
  { name: "Beauty", slug: "beauty", iconUrl: "💄" },
  { name: "Home & Living", slug: "home-living", iconUrl: "🏠" },
  { name: "Toys", slug: "toys", iconUrl: "🧸" },
];

async function main() {
  console.log("🌱 Seeding categories...");
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ Categories seeded.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());