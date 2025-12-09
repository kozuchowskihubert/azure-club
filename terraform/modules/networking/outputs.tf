output "vnet_id" {
  value = azurerm_virtual_network.main.id
}

output "vnet_name" {
  value = azurerm_virtual_network.main.name
}

output "subnet_frontend_id" {
  value = azurerm_subnet.frontend.id
}

output "subnet_backend_id" {
  value = azurerm_subnet.backend.id
}
