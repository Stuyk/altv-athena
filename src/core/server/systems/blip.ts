import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Blip } from '../../shared/interfaces/Blip';

const globalBlips: Array<Blip> = [];

export class BlipController {
    static addGlobalBlip(blip: Blip) {
        globalBlips.push(blip);
    }

    static populateGlobalBlips(player: alt.Player) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_BLIPS, globalBlips);
    }
}
