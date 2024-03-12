#!/bin/bash

if [ "$1" = "prod" ]; then
    echo "Switch to prod"
    cp config.js.prod config.js
elif [ "$1" = "localhost" ]; then
    echo "Switch to localhost"
    cp config.js.localhost config.js
else
    echo "Please enter either 'prod' or 'localhost'"
    exit 1
fi
