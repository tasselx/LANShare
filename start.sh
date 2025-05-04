#!/bin/bash
echo "Building LANShare web application..."
cd lanshare
npm install
npm run build
cd ..

echo "Starting LANShare..."
cd lanshare
node start.js
