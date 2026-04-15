# Remote state backend.
#
# We use Terraform Cloud (app.terraform.io) for remote state and workspace
# separation (staging vs. production). Configure the organization and
# workspaces under `terraform/environments/<env>/backend.tf` so that each
# environment has isolated state.
#
# Example workspace names:
#   - exam-prep-master-staging
#   - exam-prep-master-production
#
# Alternative: S3 + DynamoDB. Swap the `cloud` block for an `s3` backend:
#
#   backend "s3" {
#     bucket         = "exam-prep-master-tfstate"
#     key            = "env/<env>/terraform.tfstate"
#     region         = "us-east-1"
#     dynamodb_table = "exam-prep-master-tf-locks"
#     encrypt        = true
#   }

terraform {
  cloud {
    organization = "exam-prep-master"

    workspaces {
      tags = ["exam-prep-master"]
    }
  }
}
