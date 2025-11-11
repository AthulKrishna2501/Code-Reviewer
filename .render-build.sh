#!/bin/bash

echo "=== Starting Render Build Process ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"

set -e

echo ""
echo "=== Installing root dependencies ==="
npm install

echo ""
echo "=== Installing backend dependencies ==="
cd backend && npm install && cd ..

echo ""
echo "=== Installing frontend dependencies ==="
cd frontend && npm install && cd ..

echo ""
echo "=== Building frontend ==="
cd frontend && npm run build && cd ..

echo ""
echo "=== Build Complete ==="
echo "Checking build output:"
ls -la frontend/build/ || echo "ERROR: Build directory not found!"

if [ ! -f "frontend/build/index.html" ]; then
  echo "ERROR: index.html not found in build directory!"
  exit 1
fi

echo "SUCCESS: Frontend built successfully!"
ls -la frontend/build/index.html
