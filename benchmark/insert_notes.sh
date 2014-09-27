#!/bin/bash

wrk -t12 -c400 -d30s -s insert_notes.lua http://localhost:8080/api/notes
