#!/usr/bin/env bash

# Node.js ve npm kurulumu
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Frontend build
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Python bağımlılıklarını kur
echo "Installing Python dependencies..."
pip install -r requirements.txt
