#!/bin/bash

# ==================== Profile App Build Verification ====================
# Verify the profile app builds successfully and is ready for deployment

set -e

echo "🔍 Profile App Build Verification"
echo "=================================="
echo ""

# Check we're in the monorepo root
if [ ! -f "nx.json" ]; then
    echo "❌ Error: Must run from monorepo root"
    exit 1
fi

echo "✅ Running from monorepo root"
echo ""

# Step 1: Type checking
echo "📝 Step 1: Type checking..."
pnpm exec nx typecheck @nx-playground/profile
echo "✅ Type check passed"
echo ""

# Step 2: Linting
echo "🔍 Step 2: Linting..."
pnpm exec nx lint @nx-playground/profile
echo "✅ Lint passed"
echo ""

# Step 3: Build
echo "🏗️  Step 3: Building for production..."
pnpm exec nx build @nx-playground/profile --configuration=production
echo "✅ Build completed successfully"
echo ""

# Step 4: Verify output
echo "📦 Step 4: Verifying build output..."

if [ ! -d "dist/apps/profile" ]; then
    echo "❌ Error: Build output directory not found"
    exit 1
fi

if [ ! -f "dist/apps/profile/index.html" ]; then
    echo "❌ Error: index.html not found in build output"
    exit 1
fi

if [ ! -f "dist/apps/profile/_redirects" ]; then
    echo "❌ Error: _redirects file not found (needed for SPA routing)"
    exit 1
fi

echo "✅ Build output verified"
echo ""

# Step 5: Check build size
echo "📊 Step 5: Build statistics..."
echo "Output directory: dist/apps/profile"
du -sh dist/apps/profile
echo ""
echo "Asset files:"
ls -lh dist/apps/profile/assets/ | grep -E '\.(js|css)$' | awk '{print $9, $5}'
echo ""

echo "🎉 All checks passed!"
echo ""
echo "📋 Next steps:"
echo "  1. Test locally: cd dist/apps/profile && npx serve -p 3003"
echo "  2. Deploy to Cloudflare Pages:"
echo "     - Via Git: Push to main branch"
echo "     - Via CLI: wrangler pages deploy dist/apps/profile --project-name=your-project-name"
echo ""
echo "✨ Your profile app is ready for deployment!"
