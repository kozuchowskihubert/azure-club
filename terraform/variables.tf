variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "clubbasse"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "westeurope"
}

variable "location_secondary" {
  description = "Secondary Azure region for disaster recovery"
  type        = string
  default     = "northeurope"
}

variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default = {
    Project     = "Clubbasse"
    ManagedBy   = "Terraform"
    Repository  = "azure-club"
  }
}

# Networking
variable "vnet_address_space" {
  description = "Address space for VNet"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

variable "subnet_frontend_prefix" {
  description = "Address prefix for frontend subnet"
  type        = list(string)
  default     = ["10.0.1.0/24"]
}

variable "subnet_backend_prefix" {
  description = "Address prefix for backend subnet"
  type        = list(string)
  default     = ["10.0.2.0/24"]
}

# App Service
variable "app_service_sku" {
  description = "SKU for App Service Plan"
  type        = string
  default     = "P1v3"
}

variable "app_service_worker_count" {
  description = "Number of workers for App Service"
  type        = number
  default     = 2
}

# Database
variable "sql_database_sku" {
  description = "SKU for Azure SQL Database"
  type        = string
  default     = "S1"
}

variable "sql_admin_username" {
  description = "Admin username for SQL Server"
  type        = string
  default     = "sqladmin"
  sensitive   = true
}

# Storage
variable "storage_replication_type" {
  description = "Storage account replication type"
  type        = string
  default     = "GRS"
}

# Redis Cache
variable "redis_sku_name" {
  description = "SKU name for Redis Cache"
  type        = string
  default     = "Standard"
}

variable "redis_capacity" {
  description = "Capacity for Redis Cache"
  type        = number
  default     = 1
}

# CDN
variable "cdn_sku" {
  description = "SKU for Azure CDN"
  type        = string
  default     = "Standard_Microsoft"
}

# Monitoring
variable "log_retention_days" {
  description = "Log retention in days"
  type        = number
  default     = 90
}

variable "alert_email" {
  description = "Email for alerts"
  type        = string
  default     = "admin@clubbasse.pl"
}

# Container Registry
variable "acr_sku" {
  description = "SKU for Azure Container Registry"
  type        = string
  default     = "Standard"
}
