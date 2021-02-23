import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { TextLabel } from '../../shared/interfaces/TextLabel';
import Logger from '../utility/athenaLogger';

const globalTextLabels: Array<TextLabel> = [];

export class TextLabelController {
    /**
     * Adds a global label the player loads when they join.
     * @static
     * @param {TextLabel} label
     * @memberof TextLabelController
     */
    static add(label: TextLabel) {
        globalTextLabels.push(label);
    }

    /**
     * Adds a global label the player loads when they join.
     * Also appends it to any online players.
     * Requires a UID to remove it later.
     * @static
     * @param {TextLabel} label
     * @memberof TextLabelController
     */
    static append(label: TextLabel) {
        if (!label.uid) {
            Logger.error(`(${label.data}) Label does not have a unique id (uid).`);
            return;
        }

        TextLabelController.add(label);
        alt.emit(null, SYSTEM_EVENTS.APPEND_TEXTLABELS, label);
    }

    /**
     * Removes a text label based on uid.
     * @static
     * @param {string} uid
     * @return {*}  {boolean}
     * @memberof TextLabelController
     */
    static remove(uid: string): boolean {
        const index = globalTextLabels.findIndex((label) => label.uid === uid);
        if (index <= -1) {
            return false;
        }

        alt.emit(null, SYSTEM_EVENTS.REMOVE_TEXTLABEL, uid);
        globalTextLabels.splice(index, 1);
        return true;
    }

    /**
     * Creates all existing labels for a player.
     * @static
     * @param {alt.Player} player
     * @memberof TextLabelController
     */
    static populateGlobalLabels(player: alt.Player) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_TEXTLABELS, globalTextLabels);
    }
}
