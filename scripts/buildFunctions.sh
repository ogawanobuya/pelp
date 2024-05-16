#!/bin/bash

yarn workspace pelp-functions run copy-repositories
rm -rf ./packages/functions/lib
tsc --project ./packages/functions/