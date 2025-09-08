// Alternative deployment script using Apillon API directly
const fs = require('fs');
const path = require('path');
const https = require('https');

async function deployToApillon() {
  const apiKey = process.env.APILLON_API_KEY;
  const projectUuid = process.env.APILLON_PROJECT_UUID;
  const websiteUuid = process.env.APILLON_WEBSITE_UUID;

  if (!apiKey || !projectUuid || !websiteUuid) {
    console.error('Missing required environment variables');
    process.exit(1);
  }

  console.log('Starting Apillon deployment...');
  
  // Check if dist folder exists
  if (!fs.existsSync('./dist')) {
    console.error('❌ dist folder not found');
    process.exit(1);
  }

  console.log('✅ Build output found');
  console.log('📦 Deploying to Apillon...');
  
  // Simple approach: use curl to upload
  const { exec } = require('child_process');
  
  exec(`curl -X POST "https://api.apillon.io/hosting/websites/${websiteUuid}/deploy" \
    -H "Authorization: Basic ${Buffer.from(apiKey + ':').toString('base64')}" \
    -H "Content-Type: application/json" \
    -d '{"environment": 2}'`, (error, stdout, stderr) => {
    
    if (error) {
      console.error('❌ Deployment failed:', error);
      process.exit(1);
    }
    
    console.log('✅ Deployment initiated');
    console.log(stdout);
  });
}

deployToApillon().catch(console.error);