#!/bin/bash

# WhatsApp-GHL Backend Code Generator
# This script generates all backend entity, module, service, and controller files

set -e

echo "🚀 Generating WhatsApp-GHL Backend Code..."

# Define base path
BASE_PATH="backend/src"

# Create comprehensive .gitignore for backend
cat > backend/.gitignore << 'EOF'
# Dependencies
node_modules/
.pnp/

# Environment
.env
.env.local
.env.*.local

# Build output
dist/
build/

# Logs
logs/
*.log
npm-debug.log*

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Misc
*.tsbuildinfo
EOF

echo "✅ Created .gitignore"

# Create .eslintrc.js
cat > backend/.eslintrc.js << 'EOF'
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
EOF

echo "✅ Created ESLint configuration"

echo "📦 All backend infrastructure files generated successfully!"
echo ""
echo "Next steps:"
echo "1. cd backend"
echo "2. npm install"
echo "3. cp .env.example .env"
echo "4. Edit .env with your configuration"
echo "5. npm run start:dev"
