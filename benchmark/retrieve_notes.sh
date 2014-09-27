#!/bin/bash

wrk -t12 -c400 -d30s http://192.168.0.18/api/notes

