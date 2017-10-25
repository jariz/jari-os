# Jari Zwarts's insane portfolio

Witness it here:  
https://jari.io/

# Why
Because I can.

# How
[v86](https://github.com/copy/v86) & a modified boot image so we can get files into the emulator. (there's no networking for windows... unless you're willing to emulate network connection over the COM port yourself)

## Building the modified image
As stated above, we boot W95 from a modified image.  
Building the image is done on macOS _only_ with the `build-image.sh` script.  
Ironically, I haven't found a way as of yet to do this on Windows without installing weird sharefreetrialware crap.

## Generating the state
On the actual site, we load the state because this saves us from downloading the entire OS & waiting for it to boot.
This state can easily be generated by going to the [v86 site](https://copy.sh/v86/) & loading the generated boot HDD image.
