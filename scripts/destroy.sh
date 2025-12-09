#!/bin/bash

# Clubbasse.pl Infrastructure Destroy Script
# WARNING: This will destroy all Azure resources

set -e

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="${SCRIPT_DIR}/../terraform"
ENVIRONMENT="${1:-dev}"

echo -e "${RED}===================================${NC}"
echo -e "${RED}WARNING: Infrastructure Destroy${NC}"
echo -e "${RED}===================================${NC}"
echo ""

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|staging|prod)$ ]]; then
    echo -e "${RED}Error: Invalid environment '${ENVIRONMENT}'${NC}"
    echo "Usage: $0 [dev|staging|prod]"
    exit 1
fi

echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}"
echo ""
echo -e "${RED}This will DESTROY all resources in the ${ENVIRONMENT} environment!${NC}"
echo ""

# Production safeguard
if [ "$ENVIRONMENT" == "prod" ]; then
    echo -e "${RED}PRODUCTION ENVIRONMENT DETECTED${NC}"
    echo "Type 'DESTROY-PRODUCTION' to confirm:"
    read -r CONFIRM
    
    if [ "$CONFIRM" != "DESTROY-PRODUCTION" ]; then
        echo "Destruction cancelled"
        exit 0
    fi
else
    read -p "Type 'yes' to confirm destruction: " CONFIRM
    
    if [ "$CONFIRM" != "yes" ]; then
        echo "Destruction cancelled"
        exit 0
    fi
fi

# Initialize Terraform
echo ""
echo "Initializing Terraform..."
cd "${TERRAFORM_DIR}"

terraform init \
    -backend-config="resource_group_name=clubbasse-tfstate-rg" \
    -backend-config="storage_account_name=clubbassetfstate" \
    -backend-config="container_name=tfstate" \
    -backend-config="key=${ENVIRONMENT}.terraform.tfstate"

# Destroy infrastructure
echo ""
echo "Destroying infrastructure..."
terraform destroy \
    -var-file="environments/${ENVIRONMENT}.tfvars" \
    -auto-approve

echo ""
echo -e "${YELLOW}Infrastructure destroyed${NC}"
echo ""
