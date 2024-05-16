#!/bin/bash

yarn run concat-firestore-rules
firebase deploy --project=dev --only firestore