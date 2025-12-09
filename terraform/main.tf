locals {
  resource_prefix = "${var.project_name}-${var.environment}"
  common_tags = merge(var.tags, {
    Environment = var.environment
    Location    = var.location
  })
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "${local.resource_prefix}-rg"
  location = var.location
  tags     = local.common_tags
}

# Virtual Network
module "networking" {
  source = "./modules/networking"

  resource_group_name  = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  resource_prefix     = local.resource_prefix
  vnet_address_space  = var.vnet_address_space
  subnet_frontend_prefix = var.subnet_frontend_prefix
  subnet_backend_prefix  = var.subnet_backend_prefix
  tags                = local.common_tags
}

# Storage Account
module "storage" {
  source = "./modules/storage"

  resource_group_name      = azurerm_resource_group.main.name
  location                = azurerm_resource_group.main.location
  resource_prefix         = local.resource_prefix
  replication_type        = var.storage_replication_type
  tags                    = local.common_tags
}

# Azure SQL Database
module "database" {
  source = "./modules/database"

  resource_group_name = azurerm_resource_group.main.name
  location           = azurerm_resource_group.main.location
  resource_prefix    = local.resource_prefix
  sku_name           = var.sql_database_sku
  admin_username     = var.sql_admin_username
  subnet_id          = module.networking.subnet_backend_id
  tags               = local.common_tags
}

# Redis Cache
module "redis" {
  source = "./modules/redis"

  resource_group_name = azurerm_resource_group.main.name
  location           = azurerm_resource_group.main.location
  resource_prefix    = local.resource_prefix
  sku_name           = var.redis_sku_name
  capacity           = var.redis_capacity
  subnet_id          = module.networking.subnet_backend_id
  tags               = local.common_tags
}

# Container Registry
module "acr" {
  source = "./modules/acr"

  resource_group_name = azurerm_resource_group.main.name
  location           = azurerm_resource_group.main.location
  resource_prefix    = "rave-united-clubbase-lady"
  sku                = "Premium"
  tags               = merge(local.common_tags, {
    ContainerRegistry = "rave-united-clubbase-lady"
  })
}

# App Service
module "app_service" {
  source = "./modules/app_service"

  resource_group_name    = azurerm_resource_group.main.name
  location              = azurerm_resource_group.main.location
  resource_prefix       = local.resource_prefix
  sku_name              = var.app_service_sku
  worker_count          = var.app_service_worker_count
  subnet_id             = module.networking.subnet_frontend_id
  storage_account_name  = module.storage.storage_account_name
  storage_access_key    = module.storage.primary_access_key
  database_connection_string = module.database.connection_string
  redis_connection_string    = module.redis.connection_string
  key_vault_id          = module.key_vault.key_vault_id
  tags                  = local.common_tags
}

# CDN
module "cdn" {
  source = "./modules/cdn"

  resource_group_name     = azurerm_resource_group.main.name
  location               = azurerm_resource_group.main.location
  resource_prefix        = local.resource_prefix
  sku                    = var.cdn_sku
  storage_endpoint       = module.storage.primary_blob_endpoint
  app_service_endpoint   = module.app_service.default_hostname
  tags                   = local.common_tags
}

# Key Vault
module "key_vault" {
  source = "./modules/key_vault"

  resource_group_name = azurerm_resource_group.main.name
  location           = azurerm_resource_group.main.location
  resource_prefix    = local.resource_prefix
  tags               = local.common_tags
}

# Monitoring
module "monitoring" {
  source = "./modules/monitoring"

  resource_group_name        = azurerm_resource_group.main.name
  location                  = azurerm_resource_group.main.location
  resource_prefix           = local.resource_prefix
  log_retention_days        = var.log_retention_days
  alert_email               = var.alert_email
  app_service_id            = module.app_service.app_service_id
  database_id               = module.database.database_id
  redis_id                  = module.redis.redis_id
  storage_account_id        = module.storage.storage_account_id
  tags                      = local.common_tags
}
