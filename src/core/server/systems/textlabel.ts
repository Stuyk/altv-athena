import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { TextLabel } from '../../shared/interfaces/TextLabel';
import Logger from '../utility/athenaLogger';

const globalTextLabels: Array<TextLabel> = [];
let appendDataFinishTime = Date.now() + 5000;

export class TextLabelController {
    /**
     * Adds a global label the player loads when they join.
     * @static
     * @param {TextLabel} label
     * @memberof TextLabelController
     */
    static add(label: TextLabel) {
        appendDataFinishTime = Date.now() + 500;
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
        alt.emitClient(null, SYSTEM_EVENTS.APPEND_TEXTLABELS, label);
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

        alt.emitClient(null, SYSTEM_EVENTS.REMOVE_TEXTLABEL, uid);
        globalTextLabels.splice(index, 1);
        return true;
    }

    static get(): Promise<Array<TextLabel>> {
        return new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (Date.now() < appendDataFinishTime) {
                    return;
                }

                alt.clearInterval(interval);
                resolve(globalTextLabels);
            }, 100);
        });
    }

    /**
     * Updates text labels through the streamer service.
     * @static
     * @param {alt.Player} player
     * @param {Array<TextLabel>} labels
     * @memberof TextLabelController
     */
    static update(player: alt.Player, labels: Array<TextLabel>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_TEXTLABELS, labels);
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
