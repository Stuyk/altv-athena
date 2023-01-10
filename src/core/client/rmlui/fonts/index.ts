import * as alt from 'alt-client';

alt.loadRmlFont('/client/rmlui/fonts/arial.ttf', 'arial', false, false);
alt.loadRmlFont('/client/rmlui/fonts/inter-regular.ttf', 'inter', false, false);
alt.loadRmlFont('/client/rmlui/fonts/inter-bold.ttf', 'inter-bold', false, true);
alt.loadRmlFont('/client/rmlui/fonts/inter-black.ttf', 'inter-black', false, true);

if (alt.debug) {
    alt.logWarning(`Registering a font twice is normal with reconnect.`);
}
