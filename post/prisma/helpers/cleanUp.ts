// post\prisma\helpers\cleanUp.ts

import prisma from "@nihil/post/prisma/lib/client";
import { deleteSafely } from "@nihil/shared";

async function cleanUp() {
  console.log("🧹 Cleaning up post service…");
  await deleteSafely(() => prisma.post.deleteMany({}), "posts");
  console.log("🧹 Post clean up complete.");
}

cleanUp()
  .then(() => {
    console.log("🟢 post cleanUp.ts: Script executed successfully.");
  })
  .catch((e) => {
    console.error("🔴 post cleanUp.ts: Script failed:", e);
    process.exit(1);
  });

export default cleanUp;
