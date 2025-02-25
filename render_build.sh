#!/usr/bin/env bash
set -e  # Hata durumunda scripti durdur

echo "Current directory: $(pwd)"
echo "Directory contents: $(ls -la)"

# Node.js kurulumu (NVM kullanarak)
echo "Installing Node.js using nvm..."
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 18
nvm use 18

# Node.js ve npm versiyonlarını kontrol et
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Frontend build
echo "Building frontend..."
cd frontend
echo "Frontend directory contents: $(ls -la)"
npm install
npm run build
cd ..

# Frontend build dosyalarını static klasörüne taşı
echo "Moving frontend build to static..."
rm -rf static
mkdir -p static
cp -r frontend/dist/* static/
echo "Static directory contents: $(ls -la static)"

# Python bağımlılıklarını kur
echo "Installing Python dependencies..."
pip install -r requirements.txt
