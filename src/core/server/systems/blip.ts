import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Blip } from '../../shared/interfaces/blip';
import { DEFAULT_CONFIG } from '../athena/main';
import { sha256Random } from '../utility/encryption';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';

const globalBlips: Array<Blip> = [];

export class ServerBlipController {
    /**
     * Adds a global label the player loads when they join.
     * Also appends it to any online players.
     * Requires a UID to remove it later.
     * @static
     * @param {Blip} label
     * @returns {string} A uid to remove it later.
     * @memberof BlipController
     */
    static append(blip: Blip): string {
        if (!blip.uid) {
            blip.uid = sha256Random(JSON.stringify(blip));
        }

        const index = globalBlips.findIndex((existing) => existing && existing.uid === blip.uid);
        if (index >= 0) {
            globalBlips[index] = blip;
        } else {
            globalBlips.push(blip);
        }

        alt.emitAllClients(SYSTEM_EVENTS.APPEND_BLIP, blip);
        return blip.uid;
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

        alt.emitAllClients(SYSTEM_EVENTS.REMOVE_BLIP, uid);
        globalBlips.splice(index, 1);
        return true;
    }

    /**
     * Remove a blip from the player.
     * @static
     * @param {alt.Player} player
     * @param {string} uid
     * @memberof BlipController
     */
    static removeFromPlayer(player: alt.Player, uid: string) {
        if (!uid) {
            throw new Error(`Did not specify a uid for object removal. ObjectController.removeFromPlayer`);
        }

        alt.emitClient(player, SYSTEM_EVENTS.REMOVE_BLIP, uid);
    }

    /**
     * Add a blip to the player.
     * @static
     * @param {alt.Player} player
     * @param {Blip} blipData
     * @memberof BlipController
     */
    static addToPlayer(player: alt.Player, blipData: Blip) {
        if (!blipData.uid) {
            throw new Error(`Object ${JSON.stringify(blipData)} does not have a uid. ObjectController.addToPlayer`);
        }

        alt.emitClient(player, SYSTEM_EVENTS.APPEND_BLIP, blipData);
    }

    static populateGlobalBlips(player: alt.Player) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_BLIPS, globalBlips);
    }
}

DEFAULT_CONFIG.VALID_HOSPITALS.forEach((position) => {
    const hash = sha256Random(JSON.stringify(position));
    ServerBlipController.append({
        text: LocaleController.get(LOCALE_KEYS.LABEL_HOSPITAL),
        color: 6,
        sprite: 153,
        scale: 1,
        shortRange: true,
        pos: position,
        uid: hash,
    });
});
