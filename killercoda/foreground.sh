#!/bin/bash

echo "Setting up the CrowdSec Cloudflare Bouncer environment..."
echo ""
echo "This includes:"
echo "  - Installing Node.js"
echo "  - Installing Go"
echo "  - Building the Cloudflare Worker Bouncer"
echo "  - Building the GUI application"
echo ""
echo "This may take 5-10 minutes. Please wait..."
echo ""

# Wait for background script to start
sleep 2
if [ ! -f /tmp/.background-started ]; then
    echo "WARNING: Background script may not be running."
    echo "Check logs with: cat /var/log/setup.log"
    echo ""
fi

# Spinner animation with timeout
spin='-\|/'
i=0
timeout=600  # 10 minutes max
elapsed=0
while [ ! -f /tmp/.setup-complete ] && [ $elapsed -lt $timeout ]; do
    i=$(( (i+1) % 4 ))
    printf "\r[${spin:$i:1}] Setting up environment... (%d seconds elapsed)" $elapsed
    sleep 1
    elapsed=$((elapsed + 1))
done

if [ -f /tmp/.setup-complete ]; then
    printf "\r[OK] Environment ready!                              \n"
    echo ""
    echo "============================================"
    echo "  CrowdSec Cloudflare Bouncer GUI is ready!"
    echo "============================================"
    echo ""
    echo "Click on the 'Bouncer GUI' tab above to open the web interface."
else
    printf "\r[TIMEOUT] Setup did not complete in time.            \n"
    echo ""
    echo "Check logs with: cat /var/log/setup.log"
fi
echo ""