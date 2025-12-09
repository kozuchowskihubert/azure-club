#!/bin/bash

# Clubbasse.pl Infrastructure Deployment Script
# This script deploys the entire Azure infrastructure using Terraform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="${SCRIPT_DIR}/../terraform"
ENVIRONMENT="${1:-dev}"

echo -e "${GREEN}===================================${NC}"
echo -e "${GREEN}Clubbasse.pl Infrastructure Deploy${NC}"
echo -e "${GREEN}===================================${NC}"
echo ""

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
    echo -e "${RED}Error: Invalid environment '${ENVIRONMENT}'${NC}"
    echo "Usage: $0 [dev|staging|prod]"
    exit 1
fi

echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}"
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v az &> /dev/null; then
    echo -e "${RED}Azure CLI is not installed${NC}"
    exit 1
fi

if ! command -v terraform &> /dev/null; then
    echo -e "${RED}Terraform is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites met${NC}"
echo ""

# Azure login check
echo "Checking Azure login..."
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}Not logged in to Azure. Logging in...${NC}"
    az login
fi

SUBSCRIPTION_ID=$(az account show --query id -o tsv)
echo -e "${GREEN}✓ Logged in to Azure subscription: ${SUBSCRIPTION_ID}${NC}"
echo ""

# Initialize Terraform
echo "Initializing Terraform..."
cd "${TERRAFORM_DIR}"

terraform init \
    -backend-config="resource_group_name=clubbasse-tfstate-rg" \
    -backend-config="storage_account_name=clubbassetfstate" \
    -backend-config="container_name=tfstate" \
    -backend-config="key=${ENVIRONMENT}.terraform.tfstate"

echo -e "${GREEN}✓ Terraform initialized${NC}"
echo ""

# Validate Terraform configuration
echo "Validating Terraform configuration..."
terraform validate

echo -e "${GREEN}✓ Configuration valid${NC}"
echo ""

# Plan infrastructure changes
echo "Planning infrastructure changes..."
terraform plan \
    -var-file="environments/${ENVIRONMENT}.tfvars" \
    -out="${ENVIRONMENT}.tfplan"

echo ""
echo -e "${YELLOW}Review the plan above${NC}"
read -p "Do you want to apply these changes? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${YELLOW}Deployment cancelled${NC}"
    rm -f "${ENVIRONMENT}.tfplan"
    exit 0
fi

# Apply infrastructure changes
echo ""
echo "Applying infrastructure changes..."
terraform apply "${ENVIRONMENT}.tfplan"

echo -e "${GREEN}✓ Infrastructure deployed successfully${NC}"
echo ""

# Clean up plan file
rm -f "${ENVIRONMENT}.tfplan"

# Output important values
echo "Retrieving outputs..."
terraform output -json > "${ENVIRONMENT}-outputs.json"

APP_URL=$(terraform output -raw app_service_url)
CDN_URL=$(terraform output -raw cdn_endpoint_url)

echo ""
echo -e "${GREEN}===================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}===================================${NC}"
echo ""
echo "Application URL: ${APP_URL}"
echo "CDN URL: ${CDN_URL}"
echo ""
echo "Outputs saved to: ${ENVIRONMENT}-outputs.json"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Deploy application code via GitHub Actions"
echo "2. Configure custom domain and SSL"
echo "3. Set up monitoring alerts"
echo "4. Run smoke tests"
echo ""
