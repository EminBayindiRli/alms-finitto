#!/usr/bin/env bash
set -e  # Hata durumunda scripti durdur

echo "Current directory: $(pwd)"
echo "Directory contents: $(ls -la)"

# Node.js ve npm kurulumu
echo "Installing Node.js and npm..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get update
apt-get install -y nodejs
npm install -g npm@latest

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
