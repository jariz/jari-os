#!/usr/bin/env bash

# variables to play with
out="images/W95-MOD.IMG"
shadow="/tmp/jari.shadow"
mount="./w95"

echo "Generating custom w95 image..."

if [ ! -f ./images/W95.IMG ]; then
    echo "Base image does not exist yet, 🔽 ..."
    wget -P images/ https://i.copy.sh/images/W95.IMG
fi

echo "Mounting..."
diskinfo=$(hdiutil attach images/W95.IMG -mountpoint ${mount} -shadow ${shadow} -noverify)
device=$(echo $diskinfo | cut -d' ' -f1)
echo "Done. Mounted as: $device"

echo "Copying files to mounted disk..."
cp -R disk w95

echo "Unmounting sector 1..."
diskutil unmount ${device}s1

echo "Writing image to $out"
dd if=${device} of=${out}

echo "Cleaning up..."
rm ${shadow}

echo "Ejecting..."
diskutil unmountDisk ${device}
diskutil eject ${device}

echo "Complete! Find your image @ '${out}'"
