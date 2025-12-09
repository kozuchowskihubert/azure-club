# App Serviceresource "azurerm_linux_web_app" "frontend" resource "azurerm_linux_web_app" "backend" {
  name                = "${var.app_service_name}-backend"
  resource_group_name = var.resource_group_name
  location            = var.location
  service_plan_id     = azurerm_service_plan.main.id

  site_config {
    always_on = true
    
    application_stack {
      docker_image_name   = "raveunitedclubbaseladyacr.azurecr.io/clubbase-backend:latest"
      docker_registry_url = "https://raveunitedclubbaseladyacr.azurecr.io"
    }            = "${var.app_service_name}-frontend"
  resource_group_name = var.resource_group_name
  location            = var.location
  service_plan_id     = azurerm_service_plan.main.id

  site_config {
    always_on = true
    
    application_stack {
      docker_image_name   = "raveunitedclubbaseladyacr.azurecr.io/clubbase-frontend:latest"
      docker_registry_url = "https://raveunitedclubbaseladyacr.azurecr.io"
    }ource "azurerm_service_plan" "main" {
  name                = "${var.resource_prefix}-asp"
  resource_group_name = var.resource_group_name
  location            = var.location
  os_type             = "Linux"
  sku_name            = var.sku_name
  worker_count        = var.worker_count

  tags = var.tags
}

resource "azurerm_linux_web_app" "frontend" {
  name                = "${var.resource_prefix}-frontend"
  resource_group_name = var.resource_group_name
  location            = var.location
  service_plan_id     = azurerm_service_plan.main.id

  site_config {
    always_on = true
    
    application_stack {
      node_version = "20-lts"
    }

    cors {
      allowed_origins = ["*"]
    }
  }

  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "WEBSITE_NODE_DEFAULT_VERSION"        = "~20"
    "DATABASE_URL"                        = var.database_connection_string
    "REDIS_URL"                           = var.redis_connection_string
    "STORAGE_ACCOUNT_NAME"                = var.storage_account_name
    "KEY_VAULT_NAME"                      = "@Microsoft.KeyVault(SecretUri=${var.key_vault_id})"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = var.tags
}

resource "azurerm_linux_web_app" "backend" {
  name                = "${var.resource_prefix}-backend"
  resource_group_name = var.resource_group_name
  location            = var.location
  service_plan_id     = azurerm_service_plan.main.id

  site_config {
    always_on = true
    
    application_stack {
      node_version = "20-lts"
    }
  }

  app_settings = {
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE" = "false"
    "WEBSITE_NODE_DEFAULT_VERSION"        = "~20"
    "DATABASE_URL"                        = var.database_connection_string
    "REDIS_URL"                           = var.redis_connection_string
    "STORAGE_ACCOUNT_NAME"                = var.storage_account_name
  }

  identity {
    type = "SystemAssigned"
  }

  tags = var.tags
}

# VNet Integration
resource "azurerm_app_service_virtual_network_swift_connection" "frontend" {
  app_service_id = azurerm_linux_web_app.frontend.id
  subnet_id      = var.subnet_id
}

resource "azurerm_app_service_virtual_network_swift_connection" "backend" {
  app_service_id = azurerm_linux_web_app.backend.id
  subnet_id      = var.subnet_id
}
