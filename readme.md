# Jari Zwarts's insane portfolio

Witness it here:  
https://jari.io/

## Why
Because I can.

## How
[v86](https://github.com/copy/v86) & a modified boot image so we can get files into the emulator.

## Running
Because of the amount of requests the emulator makes, it is fairly vital to run the site on http2.  
Upon first cloning this repo, run `npm run cert` to generate certificates.  
Add `certs/cert.pem` to your trusted certs.  
Then, `npm start`.  
  

## Why build a custom image?
It's the only way to get files into the machine:

- There's support for writing to the filesystem, but not on windows guests.
- There's support for networking, but not on windows guests. 

## Building the modified image
As stated above, we boot W95 from a modified image.  
Building the image is done on macOS _only_ with the `build-image.sh` script.  
Ironically, I haven't found a way as of yet to do this on Windows without installing weird sharetrialware crap.

## Generating the state
On the actual site, we load the state because this saves us from downloading the entire OS & having to wait for it to boot.  
This state can easily be created yourself by going to the [v86 site](https://copy.sh/v86/), loading the generated boot HDD image, and clicking 'save state'.  
Save it as `v86state.bin` in the images folder.

## Once booted

- Open netscape from `C:\Disk\Navigator\Program`
- Navigate to `C:\Disk\PORTFOLIO\index.html`
