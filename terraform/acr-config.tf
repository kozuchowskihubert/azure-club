# ACR Configuration for rave-united-clubbase-lady
# This file contains specific ACR settings for the container registry

locals {
  acr_config = {
    name          = "raveunitedclubbaseladyacr"
    login_server  = "raveunitedclubbaseladyacr.azurecr.io"
    sku           = "Premium"
    
    repositories = {
      frontend = "clubbase-frontend"
      backend  = "clubbase-backend"
    }
    
    images = {
      frontend_latest = "raveunitedclubbaseladyacr.azurecr.io/clubbase-frontend:latest"
      backend_latest  = "raveunitedclubbaseladyacr.azurecr.io/clubbase-backend:latest"
    }
    
    features = {
      admin_enabled           = true
      geo_replication_enabled = true
      zone_redundancy_enabled = true
      quarantine_enabled      = true
      retention_enabled       = true
      retention_days          = 30
    }
  }
}

# Output ACR configuration for use in other modules
output "acr_config" {
  value = local.acr_config
  description = "ACR configuration for rave-united-clubbase-lady"
}
