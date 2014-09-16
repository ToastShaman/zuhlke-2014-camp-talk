#!/bin/bash
PIDFile="/var/projects/server/bin/backend.pid"
kill -SIGUSR2 $(<"$PIDFile")
