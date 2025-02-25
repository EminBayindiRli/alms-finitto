#!/bin/bash

# Frontend build
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Move frontend build to static directory
echo "Moving frontend build to static..."
rm -rf static
mkdir -p static
cp -r frontend/dist/* static/

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Start the application
echo "Starting the application..."
python main.py
