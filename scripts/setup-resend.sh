#!/bin/bash

# 🚀 Resend Email Setup Script for ARCH1TECT
# This script helps you quickly configure Resend email service

set -e

echo "📧 ARCH1TECT Email Configuration - Resend Setup"
echo "=============================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

echo "📋 Before continuing, make sure you have:"
echo "   1. Created account at https://resend.com"
echo "   2. Added and verified domain 'haos.fm' in Resend Dashboard"
echo "   3. Created API Key in Resend Dashboard → API Keys"
echo ""

read -p "Have you completed the above steps? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "⚠️  Please complete the setup first:"
    echo "   1. Go to https://resend.com/signup"
    echo "   2. Dashboard → Domains → Add Domain → haos.fm"
    echo "   3. Add DNS records shown in Resend (TXT and MX)"
    echo "   4. Wait for verification (~5 minutes)"
    echo "   5. Dashboard → API Keys → Create API Key"
    echo "   6. Run this script again"
    exit 1
fi

echo ""
echo "🔑 Enter your Resend API Key (starts with 're_'):"
read -s RESEND_API_KEY
echo ""

if [[ ! $RESEND_API_KEY =~ ^re_ ]]; then
    echo "❌ Invalid API key format. Resend keys should start with 're_'"
    exit 1
fi

echo "📤 Adding environment variables to Vercel..."
echo ""

# Add MAIL_SERVER
echo "MAIL_SERVER=smtp.resend.com" | vercel env add MAIL_SERVER production --force

# Add MAIL_PORT
echo "587" | vercel env add MAIL_PORT production --force

# Add MAIL_USE_TLS
echo "True" | vercel env add MAIL_USE_TLS production --force

# Add MAIL_USE_SSL
echo "False" | vercel env add MAIL_USE_SSL production --force

# Add MAIL_USERNAME
echo "resend" | vercel env add MAIL_USERNAME production --force

# Add MAIL_PASSWORD (API Key)
echo "$RESEND_API_KEY" | vercel env add MAIL_PASSWORD production --force

# Add MAIL_SENDER (sender email address)
echo "arch1tect@haos.fm" | vercel env add MAIL_SENDER production --force

echo ""
echo "✅ Environment variables added successfully!"
echo ""

read -p "🚀 Deploy to production now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "📦 Deploying to Vercel..."
    vercel --prod
    echo ""
    echo "✅ Deployment complete!"
else
    echo ""
    echo "⏭️  Skipping deployment. Deploy manually with: vercel --prod"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📧 Test email sending:"
echo "   curl -X POST https://azure-club.vercel.app/api/bookings \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{"
echo "       \"name\": \"Test User\","
echo "       \"email\": \"your-email@example.com\","
echo "       \"phone\": \"+48123456789\","
echo "       \"event_date\": \"2025-12-25\","
echo "       \"event_type\": \"club\","
echo "       \"start_time\": \"22:00\","
echo "       \"venue\": \"Club HAOS\","
echo "       \"city\": \"Gdańsk\","
echo "       \"guests\": 2
echo "     }'"
echo ""
echo "📊 Monitor emails in Resend Dashboard:"
echo "   https://resend.com/emails"
echo ""
echo "✨ Done! Emails will be sent from arch1tect@haos.fm"
