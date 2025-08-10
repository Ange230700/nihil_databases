// post\prisma\main.ts

import prisma from "nihildbpost/prisma/lib/client";
import seedPosts from "nihildbpost/prisma/seed";
import { runSeed } from "nihildbshared";

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
