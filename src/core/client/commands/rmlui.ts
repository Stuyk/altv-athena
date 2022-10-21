import * as alt from 'alt-client';

const cmdName = 'rmluicontrols';

if (alt.debug) {
    alt.on('consoleCommand', (name: string) => {
        if (name !== cmdName) {
            return;
        }

        const state = alt.rmlControlsEnabled();
        alt.toggleRmlControls(!state);
        alt.showCursor(!state);
        alt.log(`Toggled Controls to: ${!state}`);
    });
}
