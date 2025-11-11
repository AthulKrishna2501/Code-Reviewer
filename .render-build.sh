#!/bin/bash
set -e

echo "=== Starting Render Build Process ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"

echo ""
echo "=== Installing root dependencies ==="
npm ci

echo ""
echo "=== Installing backend dependencies ==="
npm ci --prefix backend

echo ""
echo "=== Installing frontend dependencies ==="
npm ci --prefix frontend

echo ""
echo "=== Building frontend ==="
npm run build --prefix frontend

echo ""
echo "=== Build Complete ==="
echo "Checking build output:"
ls -la frontend/build/ 2>/dev/null || echo "ERROR: Build directory not found!"

if [ ! -f "frontend/build/index.html" ]; then
  echo "ERROR: index.html not found in build directory!"
  exit 1
fi

echo "SUCCESS: Frontend built successfully!"
