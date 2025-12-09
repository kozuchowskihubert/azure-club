output "cdn_profile_id" {
  value = azurerm_cdn_profile.main.id
}

output "cdn_endpoint_url" {
  value = "https://${azurerm_cdn_endpoint.storage.fqdn}"
}

output "storage_endpoint_fqdn" {
  value = azurerm_cdn_endpoint.storage.fqdn
}

output "app_endpoint_fqdn" {
  value = azurerm_cdn_endpoint.app.fqdn
}
