#!/bin/sh
set -eu
cd /workspace
# Auth flag is owned by .grok/app-env.json. Drop a stale inherited value so
# deleting VITE_AUTH_ENABLED from that file actually turns sign-in on.
unset VITE_AUTH_ENABLED || true
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev >>/tmp/app-startup.log 2>&1 &
