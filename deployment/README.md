# Ansible Scripts for Provisioning and Deployment

```
ansible-playbook \
  -i hosts \
  --private-key=public_keys/insecure_id_rsa \
  -u zuhlke \
  site.yml
```

## Todo

  - Install/Configure Mongod
  - Install Sun JDK 8
  - Write playbook for deploying new versions of the software
  - Add Playbooks for restarting services
  - Test installation
  - Be more specific with the iptable rules
  - Add the Ansible tag command to the tasks
  - Add yum-cron configuration files and enable security updates only
  - Add logservers (Elasticsearch / Logstash / Kibana)
  - Add Jenkins
