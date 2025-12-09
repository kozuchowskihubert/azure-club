#!/bin/bash

# Deploy to ACR using Azure Container Registry Tasks (no local Docker needed)
# This builds images in the cloud

set -e

echo "🚀 Building images in Azure (Cloud Build - No Docker required)"

# Configuration
ACR_NAME="raveunitedclubbaseladyacr"
VERSION="${1:-latest}"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}☁️  Step 1: Building Frontend in Azure${NC}"
az acr build \
  --registry $ACR_NAME \
  --image clubbase-frontend:$VERSION \
  --image clubbase-frontend:latest \
  --file docker/Dockerfile.frontend \
  --build-arg NODE_ENV=production \
  .

echo -e "${BLUE}☁️  Step 2: Building Backend in Azure${NC}"
az acr build \
  --registry $ACR_NAME \
  --image clubbase-backend:$VERSION \
  --image clubbase-backend:latest \
  --file docker/Dockerfile.backend \
  --build-arg NODE_ENV=production \
  .

echo -e "${GREEN}✅ Successfully built and pushed images to ACR${NC}"
echo -e "${YELLOW}Frontend Image: ${ACR_NAME}.azurecr.io/clubbase-frontend:${VERSION}${NC}"
echo -e "${YELLOW}Backend Image: ${ACR_NAME}.azurecr.io/clubbase-backend:${VERSION}${NC}"

# Show ACR repository information
echo -e "${BLUE}📋 ACR Repository Information:${NC}"
az acr repository list --name $ACR_NAME --output table

echo -e "${BLUE}🏷️  Image Tags:${NC}"
az acr repository show-tags --name $ACR_NAME --repository clubbase-frontend --output table
az acr repository show-tags --name $ACR_NAME --repository clubbase-backend --output table

echo -e "${GREEN}🎉 Cloud Build Complete!${NC}"
