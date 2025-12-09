variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "resource_prefix" {
  type = string
}

variable "log_retention_days" {
  type = number
}

variable "alert_email" {
  type = string
}

variable "app_service_id" {
  type = string
}

variable "database_id" {
  type = string
}

variable "redis_id" {
  type = string
}

variable "storage_account_id" {
  type = string
}

variable "tags" {
  type = map(string)
}
