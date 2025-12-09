output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "app_service_url" {
  description = "URL of the App Service"
  value       = "https://${module.app_service.default_hostname}"
}

output "cdn_endpoint_url" {
  description = "URL of the CDN endpoint"
  value       = module.cdn.cdn_endpoint_url
}

output "storage_account_name" {
  description = "Name of the storage account"
  value       = module.storage.storage_account_name
}

output "container_registry_login_server" {
  description = "Login server for Azure Container Registry"
  value       = module.acr.login_server
}

output "key_vault_uri" {
  description = "URI of the Key Vault"
  value       = module.key_vault.key_vault_uri
}

output "application_insights_instrumentation_key" {
  description = "Application Insights instrumentation key"
  value       = module.monitoring.instrumentation_key
  sensitive   = true
}

output "database_server_fqdn" {
  description = "FQDN of the database server"
  value       = module.database.server_fqdn
}

output "redis_hostname" {
  description = "Hostname of Redis Cache"
  value       = module.redis.hostname
}
