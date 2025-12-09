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

variable "capacity" {
  type = number
}

variable "subnet_id" {
  type = string
}

variable "tags" {
  type = map(string)
}
