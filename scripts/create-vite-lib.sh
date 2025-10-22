#!/bin/bash

# Create Vite Library from template
# Usage: ./scripts/create-vite-lib.sh <lib-name>

set -e

LIB_NAME=$1

if [ -z "$LIB_NAME" ]; then
  echo "Error: Library name is required"
  echo "Usage: ./scripts/create-vite-lib.sh <lib-name>"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
TEMPLATE_DIR="$ROOT_DIR/templates/vite-lib-template"
LIB_DIR="$ROOT_DIR/libs/$LIB_NAME"
CURRENT_DATE=$(date +%Y-%m-%d)

echo "Creating Vite Library: $LIB_NAME"

# Check if library already exists
if [ -d "$LIB_DIR" ]; then
  echo "Error: Library '$LIB_NAME' already exists at $LIB_DIR"
  exit 1
fi

# Create library directory
mkdir -p "$LIB_DIR"

# Copy template files
echo "Copying template files..."
cp -r "$TEMPLATE_DIR"/* "$LIB_DIR"/

# Replace placeholders
echo "Replacing placeholders..."
find "$LIB_DIR" -type f -exec sed -i '' "s/LIB_NAME/$LIB_NAME/g" {} +
find "$LIB_DIR" -type f -exec sed -i '' "s/CURRENT_DATE/$CURRENT_DATE/g" {} +

# Rename template files
if [ -f "$LIB_DIR/package.json.template" ]; then
  mv "$LIB_DIR/package.json.template" "$LIB_DIR/package.json"
fi
if [ -f "$LIB_DIR/README.md.template" ]; then
  mv "$LIB_DIR/README.md.template" "$LIB_DIR/README.md"
fi

# Create basic src structure
echo "Creating src structure..."
mkdir -p "$LIB_DIR/src/lib"

# Create index.ts
cat > "$LIB_DIR/src/index.ts" << 'EOF'
export * from './lib';
EOF

# Create lib/index.ts
cat > "$LIB_DIR/src/lib/index.ts" << 'EOF'
export const example = () => {
  return 'Hello from LIB_NAME';
};
EOF
sed -i '' "s/LIB_NAME/$LIB_NAME/g" "$LIB_DIR/src/lib/index.ts"

# Update tsconfig.base.json paths
echo "Updating tsconfig.base.json..."
TSCONFIG_BASE="$ROOT_DIR/tsconfig.base.json"
if [ -f "$TSCONFIG_BASE" ]; then
  echo "⚠️  Please manually add the following to tsconfig.base.json paths:"
  echo "    \"@nx-playground/$LIB_NAME\": [\"libs/$LIB_NAME/src/index.ts\"]"
fi

# Update root tsconfig.json references
echo "Updating root tsconfig.json..."
ROOT_TSCONFIG="$ROOT_DIR/tsconfig.json"
if [ -f "$ROOT_TSCONFIG" ]; then
  echo "⚠️  Please manually add the following to root tsconfig.json references:"
  echo "    { \"path\": \"./libs/$LIB_NAME\" }"
fi

echo "✅ Vite Library '$LIB_NAME' created successfully!"
echo ""
echo "Next steps:"
echo "1. Update tsconfig.base.json paths:"
echo "   \"@nx-playground/$LIB_NAME\": [\"libs/$LIB_NAME/src/index.ts\"]"
echo ""
echo "2. Update root tsconfig.json references:"
echo "   { \"path\": \"./libs/$LIB_NAME\" }"
echo ""
echo "3. Install dependencies:"
echo "   pnpm install"
echo ""
echo "4. Build the library:"
echo "   pnpm nx build $LIB_NAME"
echo ""
echo "5. Update README.md with library details"
echo "6. Add project-specific dependencies to package.json"
echo "7. Update tsconfig.json references if library depends on other libraries"

