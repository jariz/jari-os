#!/usr/bin/env bash

# variables to play with
out="images/W98-MOD.IMG"
shadow="/tmp/jari.shadow"
mount="./w98"

echo "Deleting previous image if it exists..."
rm ${out}

echo "Generating custom image..."

if [ ! -f ./images/windows98.img ]; then
    echo "Base image does not exist yet, 🔽 ..."
    wget -P images/ http://i.copy.sh/images/windows98.img
fi

echo "Mounting..."
diskinfo=$(hdiutil attach images/windows98.img -mountpoint ${mount} -shadow ${shadow} -noverify)
device=$(echo $diskinfo | cut -d' ' -f1)
echo "Done. Mounted as: $device"

echo "Copying files to mounted disk..."
cp -R disk ${mount}

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
