#!/usr/bin/env bash
# Usage: ./scripts/set_api_url.sh https://your-railway-url.up.railway.app

if [ -z "$1" ]; then
  echo "Usage: $0 <BACKEND_URL>"
  exit 1
fi
BACKEND_URL="$1"

FILES=("js/config.js" "index.html" "admin.html" "test-booking.html")

for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    echo "Updating $f"
    sed -i.bak "s|http://localhost:5001/api|${BACKEND_URL}/api|g" "$f"
  else
    echo "File $f not found, skipping"
  fi
done

echo "Done. Files updated. Commit & push the changes to deploy frontend." 
