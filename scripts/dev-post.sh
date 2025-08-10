# scripts\dev-post.sh

set -euo pipefail

pushd post
cp -n .env.sample .env || true
npx prisma db push
npm run prisma:db:seed
npx prisma studio
popd
