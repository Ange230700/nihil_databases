# scripts\dev-user.sh

set -euo pipefail
pushd user
cp -n .env.sample .env || true
npx prisma db push
npm run prisma:db:seed
npx prisma studio
popd
