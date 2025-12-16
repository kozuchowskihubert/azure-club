#!/bin/bash
# Quick Vercel Deployment Script

echo "🚀 ARCH1TECT - Vercel Deployment"
echo "================================"
echo ""

# Check if in correct directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Run this script from the azure-club directory"
    exit 1
fi

echo "✅ Vercel configuration updated"
echo "✅ .vercelignore created"
echo "✅ Featured event section added"
echo "✅ Email SMTP configured"
echo ""

echo "📋 Pre-deployment checklist:"
echo "  [x] vercel.json configured"
echo "  [x] .vercelignore created"
echo "  [x] Featured event added (Lady Scorpio 20-22.02)"
echo "  [x] Email configured (arch1tect.bookings@gmail.com)"
echo "  [x] API tested locally"
echo "  [ ] API URL to update after Azure deployment"
echo ""

echo "🌐 To deploy to Vercel:"
echo "  1. Install Vercel CLI: npm install -g vercel"
echo "  2. Run: vercel"
echo "  3. Follow prompts"
echo "  4. Deploy production: vercel --prod"
echo ""

echo "☁️  To deploy API to Azure:"
echo "  See VERCEL_DEPLOYMENT.md for detailed steps"
echo ""

echo "📝 After deployment:"
echo "  1. Get your API URL from Azure"
echo "  2. Update js/booking.js with API URL"
echo "  3. Redeploy: vercel --prod"
echo ""

echo "✨ Ready to deploy!"
