variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "resource_prefix" {
  type = string
}

variable "sku" {
  type = string
}

variable "storage_endpoint" {
  type = string
}

variable "app_service_endpoint" {
  type = string
}

variable "tags" {
  type = map(string)
}
