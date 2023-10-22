#!/bin/bash

# Minify JavaScript
uglifyjs --compress --mangle -- src/ip_to_loc_fetch.js > dist/ipToGeolocation.min.js