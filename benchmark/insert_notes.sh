#!/bin/bash

wrk -t12 -c400 -d30s -s insert_notes.lua http://192.168.0.18
