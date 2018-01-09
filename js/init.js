window.onload = () => {
    let osUsesMouse = false;
    const useState = window.location.search !== '?forceDisk';
    const screenContainer = document.getElementById('screen_container');

    let settings = {
        memory_size: 32 * 1024 * 1024,
        screen_container: screenContainer,
        hda: {
            url: 'images/W98-MOD.IMG',
            async: useState,
            size: 314572800
        },
        autostart: true
    };

    if (useState) {
        settings.initial_state = {
            url: './images/v86state.bin',
            size: 41168
        };
    } else {
        settings = Object.assign(settings, {
            bios: {
                url: './bios/seabios.bin'
            },
            vga_bios: {
                url: './bios/vgabios.bin'
            }
        });
    }

    const emulator = window.emulator = new V86Starter(settings);

    emulator.add_listener('mouse-enable', (is_enabled) => {
        osUsesMouse = is_enabled;
    });

    let buffer = '';
    emulator.add_listener('serial0-output-char', (char) => {
        if (char === ';') {
            const links = {
                // links
                'github': 'https://github.com/jariz',
                'dribbble': 'https://dribbble.com/jariz',
                'twitter': 'https://twitter.com/JariZwarts',

                // work
                'quarry': 'https://github.com/quarryapp/',
                'batti': 'https://github.com/jariz/BattiDaemon',
                'rivulet': 'https://github.com/jariz/rivulet',
                'noti': 'https://noti.center/',
                'vibrant': 'http://jariz.github.io/vibrant.js/'
            };

            // remove non-ascii chars
            const link = buffer.split('')
                .filter(a => a.charCodeAt(0) >= 33 && a.charCodeAt(0) <= 126)
                .join('');

            buffer = '';
            if (!(link in links)) {
                console.error(`command ${link} is not a valid link`);
                return;
            }

            emulator.stop();
            glitchCanvas(() => {
                window.location = links[link];
            });
        } else {
            buffer += char;
        }
    });

    const glitchCanvas = (callback) => {
        const cvs = screenContainer.querySelector('canvas');
        const ctx = cvs.getContext('2d');
        const imageData = ctx.getImageData(0, 0, cvs.width, cvs.height);
        let iterations = -1;
        const maxIterations = 5;

        const glitchIt = () => {
            iterations++;

            glitch({
                seed: 25,
                quality: 30,
                amount: 35,
                iterations
            })
                .fromImageData(imageData)
                .toImageData()
                .then((imageData) => {
                    ctx.putImageData(imageData, 0, 0);

                    if (iterations === maxIterations) {
                        // do callback but keep glitching whilst navigating
                        callback();
                    }

                    window.requestAnimationFrame(glitchIt);
                });
        };

        window.requestAnimationFrame(glitchIt);
    };
    
    const intro = document.getElementById('intro');
    window.asciiAnim = input => {
        intro.style.opacity = 0;
        const shiftByInitial = 150;
        let shiftBy = shiftByInitial;

        const codes = input
            .split('')
            .map(ch => ch.charCodeAt(0))
        
        const anim = () => {
            intro.style.opacity = 1 - (shiftBy / shiftByInitial)
            
            const inner = codes
                .map(code => {
                    if(shiftBy !== 0 && Math.round(Math.random() * 100) === 5) {
                        return String.fromCharCode(0);
                    }
                    
                    if(code >= 33) {
                        code += shiftBy;
                    }
                    
                    return String.fromCharCode(code);
                })
                .join('');
            
            intro.innerText = inner;
            shiftBy--;
            if(shiftBy !== -1) {
                // setTimeout(() => window.requestAnimationFrame(anim), 10);
                window.requestAnimationFrame(anim)
            }
        }
        window.requestAnimationFrame(anim)
    }

    document.getElementById('screen_container').onclick = () => {
        emulator.lock_mouse();

        // todo mobile stuff
    };

    const dump_file = (ab, name) => {
        if (!(ab instanceof Array)) {
            ab = [ab];
        }

        const blob = new Blob(ab);
        download(blob, name);
    };

    const download = (file_or_blob, name) => {
        const a = document.createElement('a');
        a['download'] = name;
        a.href = window.URL.createObjectURL(file_or_blob);
        a.dataset['downloadurl'] = ['application/octet-stream', a['download'], a.href].join(':');

        if (document.createEvent) {
            const ev = document.createEvent('MouseEvent');
            ev.initMouseEvent('click', true, true, window,
                0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(ev);
        }
        else {
            a.click();
        }

        window.URL.revokeObjectURL(a.href);
    };

    window.dumpState = () =>
        emulator.save_state((error, result) => {
            if (error) {
                console.log(error.stack);
                console.log('Couldn\'t save state: ', error);
            }
            else {
                dump_file(result, 'v86state.bin');
            }
        });

    emulator.add_listener('screen-set-mode', (isGraphic) => {
        isGraphic && screenContainer.classList.add('online');
    });
};
