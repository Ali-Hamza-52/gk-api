#!/bin/bash

# Set variables
BRANCH="master"
APP_NAME="gk-ion"
GIT_REPO_NAME="gk-api"
DEPLOY_DIR="/home/salmanmarif/public_html/ion.glorek.com"
STAGING_DIR="/home/salmanmarif/deploy/gk-ion"
NODE_VERSION="v22.17.0"

# Emoji Legend
INFO="\033[1;34m[INFO]\033[0m"
SUCCESS="\033[1;32m[SUCCESS]\033[0m"
ERROR="\033[1;31m[ERROR]\033[0m"

# Step 1: Switch Node Version
printf "$INFO Switching to Node.js $NODE_VERSION using NVM...\n"
source ~/.nvm/nvm.sh
nvm use $NODE_VERSION || exit 1

# Step 2: Pull latest code
echo -e "$INFO Pulling latest code from GitHub ($BRANCH)..."
cd "$STAGING_DIR" || { echo -e "$ERROR Staging directory not found"; exit 1; }
git checkout $BRANCH
git pull origin $BRANCH || exit 1

# Step 3: Install dependencies
echo -e "$INFO Installing dependencies..."
npm install || exit 1

# Step 4: Copy .env file
echo -e "$INFO Setting up environment file..."
cp .env.pro .env

# Step 5: Build project (NestJS)
echo -e "$INFO Building the app..."
npm run build || exit 1
npm run migrate || exit 1

echo -e "$INFO Migrating permission data to normalized tables..."
npm run permissions:migrate-real || exit 1

# Step 6: Clean deployment directory
echo -e "$INFO Cleaning old deployment at $DEPLOY_DIR..."
rm -rf "$DEPLOY_DIR"/*

# Step 7: Copy build and dependencies to deployment
echo -e "$INFO Copying build files and node_modules to $DEPLOY_DIR..."
cp -r dist "$DEPLOY_DIR"/
cp -r node_modules "$DEPLOY_DIR"/
cp package.json "$DEPLOY_DIR"/
cp .env "$DEPLOY_DIR"/

# Step 8: Restart PM2
echo -e "$INFO Restarting PM2 process..."
cd "$DEPLOY_DIR" || exit 1
pm2 delete $APP_NAME >/dev/null 2>&1
npx pm2 start dist/main.js --name $APP_NAME || exit 1

# Step 9: Save PM2 config
pm2 save

echo -e "$SUCCESS Deployment complete for $APP_NAME to $DEPLOY_DIR"
