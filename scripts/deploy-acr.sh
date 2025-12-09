#!/bin/bash

# Deploy to ACR: rave-united-clubbase-lady
# This script builds and pushes Docker images to Azure Container Registry

set -e

echo "🚀 Deploying to ACR: rave-united-clubbase-lady"

# Configuration
ACR_NAME="raveunitedclubbaseladyacr"
ACR_LOGIN_SERVER="${ACR_NAME}.azurecr.io"
FRONTEND_IMAGE="${ACR_LOGIN_SERVER}/clubbase-frontend"
BACKEND_IMAGE="${ACR_LOGIN_SERVER}/clubbase-backend"
VERSION="${1:-latest}"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Step 1: Logging into Azure Container Registry${NC}"
az acr login --name $ACR_NAME

echo -e "${BLUE}🏗️  Step 2: Building Frontend Docker Image${NC}"
docker build \
  -f docker/Dockerfile.frontend \
  -t ${FRONTEND_IMAGE}:${VERSION} \
  -t ${FRONTEND_IMAGE}:latest \
  --build-arg NODE_ENV=production \
  .

echo -e "${BLUE}🏗️  Step 3: Building Backend Docker Image${NC}"
docker build \
  -f docker/Dockerfile.backend \
  -t ${BACKEND_IMAGE}:${VERSION} \
  -t ${BACKEND_IMAGE}:latest \
  --build-arg NODE_ENV=production \
  .

echo -e "${BLUE}⬆️  Step 4: Pushing Frontend Image to ACR${NC}"
docker push ${FRONTEND_IMAGE}:${VERSION}
docker push ${FRONTEND_IMAGE}:latest

echo -e "${BLUE}⬆️  Step 5: Pushing Backend Image to ACR${NC}"
docker push ${BACKEND_IMAGE}:${VERSION}
docker push ${BACKEND_IMAGE}:latest

echo -e "${GREEN}✅ Successfully deployed images to ACR${NC}"
echo -e "${YELLOW}Frontend Image: ${FRONTEND_IMAGE}:${VERSION}${NC}"
echo -e "${YELLOW}Backend Image: ${BACKEND_IMAGE}:${VERSION}${NC}"

# Show ACR repository information
echo -e "${BLUE}📋 ACR Repository Information:${NC}"
az acr repository list --name $ACR_NAME --output table

echo -e "${BLUE}🏷️  Image Tags:${NC}"
az acr repository show-tags --name $ACR_NAME --repository clubbase-frontend --output table
az acr repository show-tags --name $ACR_NAME --repository clubbase-backend --output table

echo -e "${GREEN}🎉 Deployment Complete!${NC}"
