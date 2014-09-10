#!/bin/bash

ansible-playbook \
  -i hosts \
  --private-key=keys/insecure_id_rsa \
  -u zuhlke \
  playbooks/deploy.yml
