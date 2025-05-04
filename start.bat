@echo off
echo Building LANShare web application...
cd lanshare
call npm install
call npm run build
cd ..

echo Starting LANShare...
cd lanshare
node start.js
