packer {
  required_plugins {
    amazon = {
      version = " >= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region"   {
  type    = string
  default = null
}

variable "MARIA_DB_USER" {
  type    = string
  default = "${env("MARIA_DB_USER")}"
}

variable "MARIA_DB_PASSWORD" {
  type    = string
  default = "${env("MARIA_DB_PASSWORD")}"
}

variable "MYSQL_DB" {
  type    = string
  default = "${env("MYSQL_DB")}"
}

variable "ssh_username" {
  type    = string
  default = null
}

variable "source_ami" {
  type    = string
  default = null
}

variable "ami_description" {
  type    = string
  default = null
}

variable "instance_type" {
  type    = string
  default = null
}

variable "launch_block_device_mappings_volume_size" {
  type    = number
  default = null
}

variable "launch_block_device_mappings_volume_type" {
  type    = string
  default = null
}

variable "launch_block_device_mappings_delete_on_termination" {
  type    = bool
  default = null
}

variable "build_sources" {
  type    = string
  default = null
}

variable "provisioner_users_source" {
  type    = string
  default = null
}

variable "provisioner_users_destination" {
  type    = string
  default = null
}

variable "provisioner_webapp_source" {
  type    = string
  default = null
}

variable "provisioner_webapp_destination" {
  type    = string
  default = null
}

variable "script" {
  type    = string
  default = null
}

variable "ami_name" {
  type    = string
  default = null
}

variable "launch_block_device_mappings_device_name" {
  type    = string
  default = null
}

variable "ami_users" {
  type    = list(string)
  default = null
}
variable "ami_regions" {
  type    = list(string)
  default = null
}

source "amazon-ebs" "webapp" {
  source_ami = "${var.source_ami}"

  ami_name        = "${var.ami_name}"
  ami_description = "${var.ami_description}"
  region          = "${var.aws_region}"
  ami_users       = "${var.ami_users}"
  ami_regions     = "${var.ami_regions}"

  instance_type = "${var.instance_type}"
  ssh_username  = "${var.ssh_username}"

  launch_block_device_mappings {
    device_name           = "${var.launch_block_device_mappings_device_name}"
    volume_size           = "${var.launch_block_device_mappings_volume_size}"
    volume_type           = "${var.launch_block_device_mappings_volume_type}"
    delete_on_termination = "${var.launch_block_device_mappings_delete_on_termination}"
  }
}

build {
  sources = [
    "source.amazon-ebs.webapp"
  ]

  provisioner "file" {
    source      = "${var.provisioner_users_source}"
    destination = "${var.provisioner_users_destination}"
  }

  provisioner "file" {
    source      = "${var.provisioner_webapp_source}"
    destination = "${var.provisioner_webapp_destination}"
  }

  provisioner "shell" {
    script = "set.sh"
    environment_vars = [
      "MARIA_DB_USER=${var.MARIA_DB_USER}",
      "MARIA_DB_PASSWORD=${var.MARIA_DB_PASSWORD}",
      "MYSQL_DB=${var.MYSQL_DB}"
    ]
  }
}
