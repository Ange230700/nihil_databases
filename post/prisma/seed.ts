// post\prisma\seed.ts

import prisma from "nihildbpost/prisma/lib/client";
import { faker as baseFaker } from "@faker-js/faker";
import { deleteSafely } from "nihildbshared";
import { randomUUID } from "node:crypto";

const SEED = process.env.SEED ?? "nihil-post-seed";
export const NUM_POSTS = Number(process.env.NUM_POSTS ?? 20);
const BATCH = Number(process.env.SEED_BATCH ?? 500);

// Keep services fully isolated: accept explicit IDs or fall back to synthetic
const USER_IDS: string[] = process.env.USER_IDS
  ? process.env.USER_IDS.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  : Array.from({ length: 5 }, (_, i) => `synthetic-user-${i + 1}`);

const faker = baseFaker;
faker.seed(Array.from(SEED).reduce((acc, ch) => acc + ch.charCodeAt(0), 0));

function chunk<T>(arr: T[], size: number) {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export async function seedPosts(skipCleanup = false) {
  console.time("post:seed");
  if (!skipCleanup) {
    await deleteSafely(() => prisma.post.deleteMany({}), "posts");
  } else {
    console.log("⚠️ Skipping cleanup (SKIP_CLEANUP=true)");
  }
  const now = new Date();

  const posts = Array.from({ length: NUM_POSTS }).map(() => ({
    id: randomUUID(),
    userId: faker.helpers.arrayElement(USER_IDS),
    content: faker.lorem.sentences({ min: 1, max: 3 }).slice(0, 191),
    mediaUrl: faker.datatype.boolean() ? faker.image.url() : null,
    isDeleted: false,
    createdAt: faker.date.past(),
    updatedAt: now,
    originalPostId: null,
  }));

  // Fast + idempotent
  for (const group of chunk(posts, BATCH)) {
    await prisma.post.createMany({ data: group, skipDuplicates: true });
  }

  console.log(
    `📝 Created/ensured ${NUM_POSTS} posts (users=${USER_IDS.length}).`,
  );
  console.timeEnd("post:seed");
}

export default async function seed(skipCleanup = false) {
  await seedPosts(skipCleanup);
}
