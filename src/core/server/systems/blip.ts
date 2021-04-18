import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Blip } from '../../shared/interfaces/Blip';
import { DEFAULT_CONFIG } from '../athena/main';
import Logger from '../utility/athenaLogger';
import { sha256Random } from '../utility/encryption';

const globalBlips: Array<Blip> = [];

export class BlipController {
    /**
     * Adds a global label the player loads when they join.
     * @static
     * @param {Blip} blip
     * @memberof BlipController
     */
    static add(blip: Blip) {
        globalBlips.push(blip);
    }

    /**
     * Adds a global label the player loads when they join.
     * Also appends it to any online players.
     * Requires a UID to remove it later.
     * @static
     * @param {Blip} label
     * @memberof BlipController
     */
    static append(blip: Blip) {
        if (!blip.uid) {
            Logger.error(`(${JSON.stringify(blip.pos)}) Blip does not have a unique id (uid).`);
            return;
        }

        BlipController.add(blip);
        alt.emit(null, SYSTEM_EVENTS.APPEND_BLIP, blip);
    }

    /**
     * Removes a text label based on uid.
     * @static
     * @param {string} uid
     * @return {*}  {boolean}
     * @memberof TextLabelController
     */
    static remove(uid: string): boolean {
        const index = globalBlips.findIndex((label) => label.uid === uid);
        if (index <= -1) {
            return false;
        }

        alt.emit(null, SYSTEM_EVENTS.REMOVE_BLIP, uid);
        globalBlips.splice(index, 1);
        return true;
    }

    static populateGlobalBlips(player: alt.Player) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_BLIPS, globalBlips);
    }
}

DEFAULT_CONFIG.VALID_HOSPITALS.forEach((position) => {
    const hash = sha256Random(JSON.stringify(position));
    BlipController.append({
        text: 'Hospital',
        color: 6,
        sprite: 153,
        scale: 1,
        shortRange: true,
        pos: position,
        uid: hash
    });
});
