#!/bin/bash

set -e

# Log file for debugging
exec > /var/log/setup.log 2>&1

echo "=== Starting CrowdSec Cloudflare Bouncer GUI Setup ==="

# Install Node.js 20.x
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verify Node.js installation
node --version
npm --version

# Install Go
echo "Installing Go..."
GO_VERSION="1.22.0"
curl -fsSL "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz" -o /tmp/go.tar.gz
rm -rf /usr/local/go
tar -C /usr/local -xzf /tmp/go.tar.gz
export PATH=$PATH:/usr/local/go/bin
echo 'export PATH=$PATH:/usr/local/go/bin' >> /root/.bashrc

# Verify Go installation
go version

# Clone and build the Go bouncer
echo "Building CrowdSec Cloudflare Worker Bouncer..."
cd /root
git clone https://github.com/crowdsecurity/cs-cloudflare-worker-bouncer.git
cd cs-cloudflare-worker-bouncer
git checkout feat/autonomous-worker

# Build the bouncer
make build-worker-js
make release

# Find and install the built binary
BOUNCER_DIR=$(ls -d crowdsec-cloudflare-worker-bouncer-v* 2>/dev/null | head -1)
if [ -n "$BOUNCER_DIR" ]; then
    cp "${BOUNCER_DIR}/crowdsec-cloudflare-worker-bouncer" /usr/local/bin/
    chmod +x /usr/local/bin/crowdsec-cloudflare-worker-bouncer
    echo "Bouncer installed from ${BOUNCER_DIR}"
else
    echo "ERROR: Could not find built bouncer binary"
    exit 1
fi

# Verify bouncer installation
crowdsec-cloudflare-worker-bouncer --version || echo "Bouncer installed"

# Clone the GUI repository
echo "Setting up Bouncer GUI..."
cd /root
git clone https://github.com/julienloizelet/cs-cloudflare-bouncer-gui.git

cd /root/cs-cloudflare-bouncer-gui

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building application..."
npm run build

# Create environment file
echo "BOUNCER_BINARY_PATH=crowdsec-cloudflare-worker-bouncer" > .env

# Start the server in background
echo "Starting server..."
nohup npm start > /var/log/bouncer-gui.log 2>&1 &

# Wait for server to be ready
echo "Waiting for server to start..."
for i in {1..30}; do
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "Server is ready!"
        break
    fi
    sleep 1
done

# Signal that setup is complete
touch /tmp/.setup-complete

echo "=== Setup Complete ==="