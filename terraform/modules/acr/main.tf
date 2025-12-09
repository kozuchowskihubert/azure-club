# Azure Container Registry

resource "azurerm_container_registry" "main" {
  name                = "raveunitedclubbaseladyacr"
  resource_group_name = var.resource_group_name
  location            = var.location
  sku                 = "Premium"
  admin_enabled       = true

  tags = merge(var.tags, {
    Project = "rave-united-clubbase-lady"
    ContainerRegistry = "production"
  })
}
