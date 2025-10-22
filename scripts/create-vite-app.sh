#!/bin/bash

# Create Vite App from template
# Usage: ./scripts/create-vite-app.sh <app-name> [port]

set -e

APP_NAME=$1
PORT=${2:-3000}

if [ -z "$APP_NAME" ]; then
  echo "Error: App name is required"
  echo "Usage: ./scripts/create-vite-app.sh <app-name> [port]"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
TEMPLATE_DIR="$ROOT_DIR/templates/vite-app-template"
APP_DIR="$ROOT_DIR/apps/$APP_NAME"
CURRENT_DATE=$(date +%Y-%m-%d)

echo "Creating Vite App: $APP_NAME"

# Check if app already exists
if [ -d "$APP_DIR" ]; then
  echo "Error: App '$APP_NAME' already exists at $APP_DIR"
  exit 1
fi

# Create app directory
mkdir -p "$APP_DIR"

# Copy template files
echo "Copying template files..."
cp -r "$TEMPLATE_DIR"/* "$APP_DIR"/

# Replace placeholders
echo "Replacing placeholders..."
find "$APP_DIR" -type f -exec sed -i '' "s/APP_NAME/$APP_NAME/g" {} +
find "$APP_DIR" -type f -exec sed -i '' "s/3000/$PORT/g" {} +
find "$APP_DIR" -type f -exec sed -i '' "s/CURRENT_DATE/$CURRENT_DATE/g" {} +

# Rename template files
if [ -f "$APP_DIR/package.json.template" ]; then
  mv "$APP_DIR/package.json.template" "$APP_DIR/package.json"
fi
if [ -f "$APP_DIR/README.md.template" ]; then
  mv "$APP_DIR/README.md.template" "$APP_DIR/README.md"
fi

# Create basic src structure
echo "Creating src structure..."
mkdir -p "$APP_DIR/src/components"
mkdir -p "$APP_DIR/src/features"
mkdir -p "$APP_DIR/src/lib"

# Create main.tsx
cat > "$APP_DIR/src/main.tsx" << 'EOF'
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
EOF

# Create App.tsx
cat > "$APP_DIR/src/App.tsx" << 'EOF'
export default function App() {
  return (
    <div>
      <h1>Welcome to APP_NAME</h1>
    </div>
  );
}
EOF
sed -i '' "s/APP_NAME/$APP_NAME/g" "$APP_DIR/src/App.tsx"

# Create index.html
cat > "$APP_DIR/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>APP_NAME</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF
sed -i '' "s/APP_NAME/$APP_NAME/g" "$APP_DIR/index.html"

# Update tsconfig.base.json paths
echo "Updating tsconfig.base.json..."
TSCONFIG_BASE="$ROOT_DIR/tsconfig.base.json"
if [ -f "$TSCONFIG_BASE" ]; then
  # Add path entry (manual edit required)
  echo "⚠️  Please manually add the following to tsconfig.base.json paths:"
  echo "    \"@nx-playground/$APP_NAME\": [\"apps/$APP_NAME/src\"]"
fi

echo "✅ Vite App '$APP_NAME' created successfully!"
echo ""
echo "Next steps:"
echo "1. Update tsconfig.base.json paths:"
echo "   \"@nx-playground/$APP_NAME\": [\"apps/$APP_NAME/src\"]"
echo ""
echo "2. Install dependencies:"
echo "   pnpm install"
echo ""
echo "3. Start development server:"
echo "   pnpm nx serve $APP_NAME"
echo ""
echo "4. Update README.md with project details"
echo "5. Add project-specific dependencies to package.json"

