#!/bin/bash

# ==================== Profile App Cloudflare Pages Deployment ====================
# Deploy the profile app to Cloudflare Pages

set -e

echo "🚀 Building Profile App for Production..."

# Build the project from monorepo root
cd "$(dirname "$0")/../../.."
pnpm exec nx build @nx-playground/profile --configuration=production

echo "✅ Build completed successfully!"
echo "📦 Output directory: dist/apps/profile"
echo ""
echo "📋 Next steps for Cloudflare Pages deployment:"
echo ""
echo "Option 1: Git Integration (Recommended)"
echo "  1. Push your code to GitHub/GitLab"
echo "  2. Go to Cloudflare Dashboard > Pages"
echo "  3. Create a new project and connect your repository"
echo "  4. Configure build settings:"
echo "     - Build command: pnpm exec nx build @nx-playground/profile --configuration=production"
echo "     - Build output directory: dist/apps/profile"
echo "     - Root directory: / (monorepo root)"
echo "     - Environment variables: NODE_VERSION=20"
echo ""
echo "Option 2: Direct Upload"
echo "  1. Install Wrangler: npm install -g wrangler"
echo "  2. Login: wrangler login"
echo "  3. Deploy: wrangler pages deploy dist/apps/profile --project-name=your-project-name"
echo ""
echo "🎉 Your profile app is ready for deployment!"

