import * as alt from 'alt-client';

alt.loadRmlFont('/client/rmlui/fonts/arialbd.ttf', 'arial', false, true);

if (alt.debug) {
    alt.logWarning(`Registering a font twice is normal with reconnect.`);
}
