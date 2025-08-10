set -euo pipefail

for d in user post shared; do
  echo "📦 bootstrapping $d …"
  pushd "$d" >/dev/null

  npm i
  npm run prepare

  # pre-commit
  mkdir -p .husky
  cat > .husky/pre-commit <<'HOOK'
echo "🔧 pre-commit: running lint-staged in $(basename "$(git rev-parse --show-toplevel)")"
npx lint-staged
HOOK
  chmod +x .husky/pre-commit

  # pre-push
  if [ "$d" = "shared" ]; then
    cat > .husky/pre-push <<'HOOK'
set -e
echo "🏗️ shared: building before push…"
npm run build
HOOK
  else
    cat > .husky/pre-push <<'HOOK'
set -e
echo "🧪 running tests before push…"
npm run test
HOOK
  fi
  chmod +x .husky/pre-push

  popd >/dev/null
done

echo "✅ submodule hooks installed."
