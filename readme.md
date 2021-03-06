# Jari Zwarts's insane portfolio

Witness it here:  
https://jari.io/

## Why
Because I can.

## How
[v86](https://github.com/copy/v86) & a modified boot image so we can get files into the emulator.

## No, I mean, how on earth did you manage to do this?
Like most of the earlydays browser scripting, VBScript is insanely permissive.   
You can't really imagine it nowadays, but the user is only prompted with a tiny warning that the script's that is about to run 'might be dangerous'.  
Mind you, this script can do anything a normal program can, straight from your browser. 
As so, it means we can directly write to the serial port, which gives us a way to communicate back to the hypervisor.

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
As stated above, we boot W98 from a modified image.  
Building the image is done on macOS _only_ with the `build-image.sh` script.  
Ironically, I haven't found a way as of yet to do this on Windows without installing weird sharetrialware crap.

## Generating the state
On the actual site, we load the state because this saves us from downloading the entire OS & having to wait for it to boot.  
This state can easily be created yourself by going to the [v86 site](https://copy.sh/v86/), loading the generated boot HDD image, and clicking 'save state'.  
Save it as `v86state.bin` in the images folder.

## Booting

- Add `?forceDisk` to url to boot from disk
- Wait for windows protection error
- Reset (`emulator.restart()` from console)
- Select boot with confirmation
- Press Y a 1000 times
- Profit
- Change resolution to 1280x720
- Navigate to `C:\Disk\PORTFOLIO\index.html`
