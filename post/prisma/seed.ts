// post\prisma\seed.ts

import prisma from "@nihil/post/prisma/lib/client";
import { faker } from "@faker-js/faker";
import { deleteSafely } from "@nihil/shared";

export const NUM_POSTS = 20;

async function seedPosts(skipCleanup = false) {
  if (!skipCleanup) {
    await deleteSafely(() => prisma.post.deleteMany({}), "posts");
  } else {
    console.log("⚠️ Skipping cleanup (SKIP_CLEANUP=true)");
  }

  const userIds = Array.from({ length: 5 }, (_, i) => `user-${i}`);

  const posts = Array.from({ length: NUM_POSTS }).map(() => ({
    content: faker.lorem.sentences({ min: 1, max: 3 }),
    mediaUrl: faker.datatype.boolean() ? faker.image.url() : null,
    isDeleted: false,
    createdAt: faker.date.past(),
    updatedAt: new Date(),
    userId: faker.helpers.arrayElement(userIds),
  }));

  await prisma.post.createMany({ data: posts });
  console.log(`📝 Created ${NUM_POSTS} posts.`);
}

export default seedPosts;
