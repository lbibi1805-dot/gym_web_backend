#!/bin/bash

echo "🧹 Cleaning build directory..."
rm -rf build

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building TypeScript..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Ready to deploy to Render."
    echo "📝 Next steps:"
    echo "1. git add ."
    echo "2. git commit -m 'Fix TypeScript build for production'"
    echo "3. git push origin main"
    echo "4. Redeploy on Render"
else
    echo "❌ Build failed. Please fix the errors above."
    exit 1
fi
