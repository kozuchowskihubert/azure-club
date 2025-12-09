# Azure CDN Module

resource "azurerm_cdn_profile" "main" {
  name                = "${var.resource_prefix}-cdn-profile"
  location            = var.location
  resource_group_name = var.resource_group_name
  sku                 = var.sku
  tags                = var.tags
}

resource "azurerm_cdn_endpoint" "storage" {
  name                = "${var.resource_prefix}-cdn-storage"
  profile_name        = azurerm_cdn_profile.main.name
  location            = var.location
  resource_group_name = var.resource_group_name
  
  origin {
    name      = "storage"
    host_name = replace(replace(var.storage_endpoint, "https://", ""), "/", "")
  }

  is_compression_enabled = true
  content_types_to_compress = [
    "text/plain",
    "text/html",
    "text/css",
    "application/x-javascript",
    "text/javascript",
    "application/javascript",
    "application/json",
    "application/xml"
  ]

  optimization_type = "GeneralWebDelivery"

  tags = var.tags
}

resource "azurerm_cdn_endpoint" "app" {
  name                = "${var.resource_prefix}-cdn-app"
  profile_name        = azurerm_cdn_profile.main.name
  location            = var.location
  resource_group_name = var.resource_group_name
  
  origin {
    name      = "appservice"
    host_name = var.app_service_endpoint
  }

  is_compression_enabled = true
  content_types_to_compress = [
    "text/plain",
    "text/html",
    "text/css",
    "application/x-javascript",
    "text/javascript",
    "application/javascript",
    "application/json"
  ]

  tags = var.tags
}
