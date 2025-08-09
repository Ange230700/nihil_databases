// scripts/postinstall.mjs
import { execSync } from "node:child_process";
import { rmSync } from "node:fs";

function isCIEnv() {
  const flags = [
    "CI", // GitHub Actions, many others
    "GITHUB_ACTIONS", // GitHub Actions
    "TF_BUILD", // Azure Pipelines
    "TEAMCITY_VERSION", // TeamCity
    "BUILDKITE", // Buildkite
    "CIRCLECI", // CircleCI
    "TRAVIS", // Travis CI
    "APPVEYOR", // AppVeyor
    "BITBUCKET_BUILD_NUMBER", // Bitbucket Pipelines
    "JENKINS_URL",
    "BUILD_NUMBER", // Jenkins
  ];
  return flags.some((k) => process.env[k]);
}

if (isCIEnv()) {
  console.log("CI detected; skipping local postinstall extras.");
  process.exit(0);
}

console.log("Running local postinstall tasks…");

try {
  execSync("npx tsc --version", { stdio: "inherit" });

  // Clean prior build artifacts
  const toRemove = [
    "shared/dist",
    "shared/tsconfig.tsbuildinfo",
    "user/dist",
    "user/tsconfig.tsbuildinfo",
    "post/dist",
    "post/tsconfig.tsbuildinfo",
  ];
  for (const p of toRemove) rmSync(p, { recursive: true, force: true });

  // Prisma generate for all workspaces
  execSync("npm run prisma:generate:all", { stdio: "inherit" });

  // Build all
  execSync("npm run build:all", { stdio: "inherit" });

  console.log("Local postinstall complete ✅");
} catch (e) {
  console.error("Postinstall failed ❌");
  console.error(e);
  process.exit(1);
}
