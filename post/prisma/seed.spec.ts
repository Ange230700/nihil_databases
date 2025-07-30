// post\prisma\seed.spec.ts

import prisma from "@nihil/post/prisma/lib/client";
import seedPosts, { NUM_POSTS } from "@nihil/post/prisma/seed";

describe("Post Seeding", () => {
  beforeAll(async () => {
    // Create users for foreign key constraint
    await prisma.post.deleteMany();
  }, 10000);

  afterAll(async () => {
    await prisma.post.deleteMany();
    await prisma.$disconnect();
  }, 10000);

  it("should seed posts correctly", async () => {
    await seedPosts();
    const count = await prisma.post.count();
    expect(count).toBe(NUM_POSTS);
  });
});
