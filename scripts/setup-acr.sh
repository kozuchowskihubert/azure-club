#!/bin/bash

# Setup ACR: rave-united-clubbase-lady
# This script creates the Azure Container Registry and configures it

set -e

echo "🔧 Setting up ACR: rave-united-clubbase-lady"

# Configuration
RESOURCE_GROUP="rg-rave-united-clubbase-lady"
LOCATION="westeurope"
ACR_NAME="raveunitedclubbaseladyacr"
ACR_SKU="Premium"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}📦 Step 1: Creating Resource Group${NC}"
az group create \
  --name $RESOURCE_GROUP \
  --location $LOCATION \
  --tags \
    Project="rave-united-clubbase-lady" \
    Environment="production" \
    ManagedBy="terraform"

echo -e "${BLUE}🏗️  Step 2: Creating Azure Container Registry${NC}"
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku $ACR_SKU \
  --location $LOCATION \
  --admin-enabled true \
  --tags \
    Project="rave-united-clubbase-lady" \
    Environment="production"

echo -e "${BLUE}🔐 Step 3: Retrieving ACR Credentials${NC}"
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query "passwords[0].value" -o tsv)

echo -e "${GREEN}✅ ACR Setup Complete!${NC}"
echo -e "${YELLOW}Registry Name: ${ACR_NAME}${NC}"
echo -e "${YELLOW}Login Server: ${ACR_NAME}.azurecr.io${NC}"
echo -e "${YELLOW}Username: ${ACR_USERNAME}${NC}"
echo -e "${YELLOW}Password: ${ACR_PASSWORD}${NC}"

echo -e "${BLUE}📝 Step 4: Saving credentials to .env file${NC}"
cat > .env.acr << EOF
# ACR Credentials for rave-united-clubbase-lady
ACR_NAME=${ACR_NAME}
ACR_LOGIN_SERVER=${ACR_NAME}.azurecr.io
ACR_USERNAME=${ACR_USERNAME}
ACR_PASSWORD=${ACR_PASSWORD}
DOCKER_REGISTRY=${ACR_NAME}.azurecr.io
EOF

echo -e "${GREEN}✅ Credentials saved to .env.acr${NC}"

echo -e "${BLUE}🔑 Step 5: Configuring GitHub Secrets (if needed)${NC}"
echo "Add these secrets to your GitHub repository:"
echo "  - AZURE_REGISTRY_NAME: ${ACR_NAME}"
echo "  - AZURE_REGISTRY_USERNAME: ${ACR_USERNAME}"
echo "  - AZURE_REGISTRY_PASSWORD: ${ACR_PASSWORD}"

echo -e "${GREEN}🎉 ACR Setup Complete!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Run './scripts/deploy-acr.sh' to build and push images"
echo "  2. Deploy infrastructure with 'cd terraform && terraform apply'"
