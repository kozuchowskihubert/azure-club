variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "resource_prefix" {
  type = string
}

variable "sku_name" {
  type = string
}

variable "worker_count" {
  type = number
}

variable "subnet_id" {
  type = string
}

variable "storage_account_name" {
  type = string
}

variable "storage_access_key" {
  type      = string
  sensitive = true
}

variable "database_connection_string" {
  type      = string
  sensitive = true
}

variable "redis_connection_string" {
  type      = string
  sensitive = true
}

variable "key_vault_id" {
  type = string
}

variable "tags" {
  type = map(string)
}
