import * as alt from 'alt-client';
import * as native from 'natives';
import { PLAYER_SYNCED_META } from '../../../../shared/enums/playerSynced';
import { ConsoleCommander } from '../../../../shared/utility/consoleCommander';

class ClientPlugin {
    static async init() {
        ConsoleCommander.init(alt);
        ConsoleCommander.registerConsoleCommand('/commands', ClientPlugin.commands);
        ConsoleCommander.registerConsoleCommand('/pos', ClientPlugin.position);
        ConsoleCommander.registerConsoleCommand('/position', ClientPlugin.position);
        ConsoleCommander.registerConsoleCommand('/heading', ClientPlugin.heading);
        ConsoleCommander.registerConsoleCommand('/id', ClientPlugin.id);
    }

    static commands() {
        const commands = ConsoleCommander.getCommands();
        alt.log(`=== Console Commands ===`);
        for (let i = 0; i < commands.length; i++) {
            alt.log(commands[i]);
        }
    }

    static position() {
        if (alt.Player.local.vehicle) {
            alt.logWarning(`VEHICLE: ${JSON.stringify(alt.Player.local.vehicle.pos)}`);
        }

        alt.logWarning(`PLAYER: ${JSON.stringify(alt.Player.local.pos)}`);
    }

    static heading() {
        if (alt.Player.local.vehicle) {
            const vehicleHeading = native.getEntityHeading(alt.Player.local.vehicle.scriptID);
            alt.logWarning(`VEHICLE HEADING: ${vehicleHeading}`);
        }

        const playerHeading = native.getEntityHeading(alt.Player.local.scriptID);
        alt.logWarning(`PLAYER HEADING: ${playerHeading}`);
    }

    static id() {
        if (alt.Player.local.vehicle) {
            alt.logWarning(`VEHICLE ID: ${alt.Player.local.vehicle.id}`);
        }

        if (alt.Player.local.hasSyncedMeta(PLAYER_SYNCED_META.ACCOUNT_ID)) {
            const id = alt.Player.local.getSyncedMeta(PLAYER_SYNCED_META.ACCOUNT_ID);
            alt.logWarning(`ACCOUNT ID: ${id}`);
        }

        alt.logWarning(`PLAYER ID: ${alt.Player.local.id}`);
    }
}

ClientPlugin.init();
