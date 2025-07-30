// post\prisma\main.ts

import prisma from "@nihil/post/prisma/lib/client";
import seedPosts from "@nihil/post/prisma/seed";
import { runSeed } from "@nihil/shared";

async function main() {
  runSeed(seedPosts, "Post seeding");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
