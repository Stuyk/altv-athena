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

function handleEarlyConnect(player: alt.Player) {
    if (!(player instanceof alt.Player)) {
        return;
    }

    if (!player) {
        return;
    }

    player.kick('Connected too early. Sever still warming up.');
}

try {
    const result = fs.readFileSync('package.json').toString();
    const data = JSON.parse(result);
    process.env.ATHENA_VERSION = data.version;

    alt.logWarning(`[Athena] Your Server Version is: ${process.env.ATHENA_VERSION}`);
} catch (err) {
    alt.logWarning(`[Athena] Could not fetch version from package.json. Is there a package.json?`);
}
