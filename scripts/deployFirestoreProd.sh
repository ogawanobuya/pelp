#!/bin/bash

yarn run concat-firestore-rules
firebase deploy --project=prod --only firestore