terraform {
  cloud {
    organization = "exam-prep-master"

    workspaces {
      name = "exam-prep-master-production"
    }
  }
}
