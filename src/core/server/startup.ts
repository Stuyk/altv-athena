import * as alt from 'alt-server';
import { Events_Misc } from '../shared/enums/events';
import './athena/index';
import fs from 'fs';

alt.on('playerConnect', handleEarlyConnect);
alt.on(Events_Misc.EnableEntry, handleEntryToggle);

function handleEntryToggle() {
    alt.off('playerConnect', handleEarlyConnect);
    alt.log(`[Athena] Server Warmup Complete. Now taking connections.`);
}

/**
 * Prevent early connections until server is warmed up.
 * @param {alt.Player} player
 * @return {*}  {void}
 */
function handleEarlyConnect(player: alt.Player): void {
    if (!(player instanceof alt.Player) || !player || !player.valid) {
        return;
    }

    try {
        player.kick('Connected too early. Server still warming up.');
    } catch (err) {
        alt.log(`[Athena] A reconnection event happened too early. Try again.`);
    }
}

try {
    const result = fs.readFileSync('package.json').toString();
    const data = JSON.parse(result);
    process.env.ATHENA_VERSION = data.version;

    alt.logWarning(`[Athena] Your Server Version is: ${process.env.ATHENA_VERSION}`);
} catch (err) {
    alt.logWarning(`[Athena] Could not fetch version from package.json. Is there a package.json?`);
}
