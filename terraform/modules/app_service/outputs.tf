output "app_service_id" {
  value = azurerm_linux_web_app.frontend.id
}

output "frontend_id" {
  value = azurerm_linux_web_app.frontend.id
}

output "backend_id" {
  value = azurerm_linux_web_app.backend.id
}

output "default_hostname" {
  value = azurerm_linux_web_app.frontend.default_hostname
}

output "frontend_principal_id" {
  value = azurerm_linux_web_app.frontend.identity[0].principal_id
}

output "backend_principal_id" {
  value = azurerm_linux_web_app.backend.identity[0].principal_id
}
