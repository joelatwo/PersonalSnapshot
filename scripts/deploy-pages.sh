#!/usr/bin/env bash
set -euo pipefail

npm run build
rm -rf docs
mkdir -p docs
cp -R dist/. docs/
cp -R docs/. .

echo "Build complete. Copy dist/ output into docs/ and commit/push to GitHub Pages."
