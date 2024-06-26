
instance_type                                      = "t2.micro"
source_ami                                         = "ami-06db4d78cb1d3bbf9"
ssh_username                                       = "admin"
ami_users                                          = [109832770766, 758550740954]
aws_region                                         = "us-east-1"
ami_name                                           = "csye6225"
ami_description                                    = "AMI for CSYE6225"
launch_block_device_mappings_device_name           = "/dev/xvda"
launch_block_device_mappings_volume_size           = "25"
launch_block_device_mappings_volume_type           = "gp2"
launch_block_device_mappings_delete_on_termination = "true"
provisioner_users_source                           = "users.csv"
provisioner_users_destination                      = "/home/admin/users.csv"
provisioner_webapp_source                          = "webapp.zip"
provisioner_webapp_destination                     = "/home/admin/webapp.zip"
ami_regions = [
  "us-east-1"   
]
