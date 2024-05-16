#!/bin/bash

array_text=("admin" "enterprise" "vendor" "support" "firestore" "functions")

for target in $(echo "${array_text[@]}"); do
  bash -c "yarn run deploy:${target}:development" &
done
wait