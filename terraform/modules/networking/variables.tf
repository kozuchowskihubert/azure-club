variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}

variable "resource_prefix" {
  type = string
}

variable "vnet_address_space" {
  type = list(string)
}

variable "subnet_frontend_prefix" {
  type = list(string)
}

variable "subnet_backend_prefix" {
  type = list(string)
}

variable "tags" {
  type = map(string)
}
