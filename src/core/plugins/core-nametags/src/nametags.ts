import * as alt from 'alt-server';
import NametagConfig from './config';
import { PlayerEvents } from '../../../server/events/playerEvents';
import { NAMETAG_EVENTS } from '../../../shared-plugins/core-nametags/enums';
import { ATHENA_EVENTS_PLAYER } from '../../../shared/enums/athenaEvents';

function passConfiguration(player: alt.Player) {
    alt.emitClient(player, NAMETAG_EVENTS.CONFIG, NametagConfig);
}

export class Nametags {
    /**
     * Creates a callback handler for setting up nametags when the user spawns.
     * @static
     * @memberof Nametags
     */
    static init() {
        PlayerEvents.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, passConfiguration);
    }
}
