#!/bin/bash
cd /home/kavia/workspace/code-generation/healthcare-appointment-management-system-4442-4463/backend_api
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

