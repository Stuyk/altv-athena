import * as alt from 'alt-server';
import { INTERIOR_INTERACTIONS } from '../../../shared-plugins/core-interiors/enums';
import { deepCloneObject } from '../../../shared/utility/deepCopy';
import { InteriorInternal } from './interfaces';
import { InteriorSystem } from './system';

export class InteriorView {
    /**
     * Usually called internally to show a menu to the player.
     * This menu is called through the interaction controller.
     * @static
     * @param {alt.Player} player
     * @param {string} uid
     * @param {boolean} [isOutside=true]
     * @return {*}
     * @memberof InteriorView
     */
    static async showMenu(player: alt.Player, uid: string, isOutside: boolean = true) {
        if (!player || !player.valid || player.data.isDead || !uid) {
            return;
        }

        const interior = await InteriorSystem.get(uid);
        if (!interior) {
            return;
        }

        const data = deepCloneObject<InteriorInternal>(interior);
        delete data.players;
        delete data.factions;
        delete data.storage;
        delete data.insideShape;
        delete data.outsideShape;
        delete data.ipl;

        alt.emitClient(player, INTERIOR_INTERACTIONS.SHOW_MENU, interior, isOutside);
    }
}
