#!/bin/bash

echo "Setting up the CrowdSec Cloudflare Bouncer environment..."
echo ""
echo "This includes:"
echo "  - Installing Node.js"
echo "  - Installing Go"
echo "  - Building the Cloudflare Worker Bouncer"
echo "  - Building the GUI application"
echo ""
echo "This may take a few minutes. Please wait..."
echo ""

# Spinner animation
spin='-\|/'
i=0
while [ ! -f /tmp/.setup-complete ]; do
    i=$(( (i+1) % 4 ))
    printf "\r[${spin:$i:1}] Setting up environment..."
    sleep 0.5
done

printf "\r[OK] Environment ready!          \n"
echo ""
echo "============================================"
echo "  CrowdSec Cloudflare Bouncer GUI is ready!"
echo "============================================"
echo ""
echo "Click on the 'Bouncer GUI' tab above to open the web interface."
echo ""