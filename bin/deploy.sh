#! bin/bash

# Update code
git pull origin main

# Install dependencies
yarn install

# Restart bot
pm2 restart ecosystem.config.js