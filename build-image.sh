#!/usr/bin/env bash

echo "Generating custom w95 image..."

if [ ! -f ./images/W95.IMG ]; then
    echo "Base image does not exist yet, 🔽 ..."
    wget -P images/ https://i.copy.sh/images/W95.IMG
fi

echo "Mounting..."
hdiutil attach images/W95.IMG -mountpoint ./w95 -shadow /tmp/jari.shadow -noverify

echo "Copying files to disk..."
cp -R disk w95
