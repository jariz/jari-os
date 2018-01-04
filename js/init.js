window.onload = function () {
    var os_uses_mouse = false;
    var useState = window.location.search !== '?forceDisk';

    var settings = {
        memory_size: 32 * 1024 * 1024,
        screen_container: document.getElementById('screen_container'),
        hda: {
            url: 'images/W98-MOD.IMG',
            async: useState,
            size: 231 * 1024 * 1024,
        },
        autostart: true,
    };

    if (useState) {
        settings.initial_state = {
            url: './images/v86state.bin',
            size: 41168,
        };
    } else {
        settings = Object.assign(settings, {
            bios: {
                url: './bios/seabios.bin',
            },
            vga_bios: {
                url: './bios/vgabios.bin',
            },
        });
    }

    const emulator = window.emulator = new V86Starter(settings);

    emulator.add_listener('mouse-enable', function (is_enabled) {
        os_uses_mouse = is_enabled;
    });

    emulator.add_listener("serial0-output-char", function(char) {
        console.log(char);
    });

    document.getElementById('screen_container').onclick = function () {
        emulator.lock_mouse();
        // emulator.screen_go_fullscreen();

        // todo mobile stuff
    };

    function dump_file(ab, name)
    {
        if(!(ab instanceof Array))
        {
            ab = [ab];
        }

        var blob = new Blob(ab);
        download(blob, name);
    }

    function download(file_or_blob, name)
    {
        var a = document.createElement('a');
        a['download'] = name;
        a.href = window.URL.createObjectURL(file_or_blob);
        a.dataset['downloadurl'] = ['application/octet-stream', a['download'], a.href].join(':');

        if(document.createEvent)
        {
            var ev = document.createEvent('MouseEvent');
            ev.initMouseEvent('click', true, true, window,
                0, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(ev);
        }
        else
        {
            a.click();
        }

        window.URL.revokeObjectURL(a.href);
    }

    document.getElementById('dumpstate').onclick = () =>
        emulator.save_state(function(error, result)
        {
            if(error)
            {
                console.log(error.stack);
                console.log('Couldn\'t save state: ', error);
            }
            else
            {
                dump_file(result, 'v86state.bin');
            }
        });

    emulator.add_listener('screen-set-mode', (isGraphic) => {
        isGraphic && document.getElementById('screen_container').classList.add('online')
    })
};
