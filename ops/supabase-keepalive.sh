#!/usr/bin/env bash
# Keep the leadzap-marketing Supabase project active so it never hits the
# 7-day idle auto-pause. (That pause took the app's admin login down in June 2026.)
# Pings the project's REST API with the PUBLIC anon key — this is a normal client
# request, it just resets Supabase's inactivity timer. Runs from cron daily.
set -uo pipefail
KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmZ2tieHJ4em1qZXhudXd3aGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NzMyMTMsImV4cCI6MjA5NjU0OTIxM30.qqrzjOWLYdAlNrM4XtnalRavXKoHwXhEcEM0vaveq7I"
URL="https://tfgkbxrxzmjexnuwwhcj.supabase.co/rest/v1/"
CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 30 -H "apikey: ${KEY}" -H "Authorization: Bearer ${KEY}" "${URL}")
echo "$(date -u +%FT%TZ) supabase keepalive -> http=${CODE}"
