import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { TextLabel } from '../../shared/interfaces/TextLabel';
import Logger from '../utility/athenaLogger';
import { StreamerService } from './streamer';

const globalTextLabels: Array<TextLabel> = [];
const KEY = 'labels';

export class TextLabelController {
    /**
     * Internal function to refresh all global text labels in the streamer service.
     * @static
     * @memberof TextLabelController
     */
    static refresh() {
        StreamerService.updateData(KEY, globalTextLabels);
    }

    /**
     * Adds a text label to the global streamer.
     * @static
     * @param {TextLabel} label
     * @memberof TextLabelController
     */
    static append(label: TextLabel) {
        if (!label.uid) {
            Logger.error(`(${label.data}) Label does not have a unique id (uid).`);
            return;
        }

        globalTextLabels.push(label);
        TextLabelController.refresh();
    }

    /**
     * Removes a text label based on uid from the global streamer
     * @static
     * @param {string} uid
     * @return {boolean}
     * @memberof TextLabelController
     */
    static remove(uid: string): boolean {
        const index = globalTextLabels.findIndex((label) => label.uid === uid);
        if (index <= -1) {
            return false;
        }

        globalTextLabels.splice(index, 1);
        TextLabelController.refresh();
        return true;
    }

    /**
     * Remove a local text label from a player.
     * @static
     * @param {alt.Player} player
     * @param {string} uid
     * @memberof TextLabelController
     */
    static removeFromPlayer(player: alt.Player, uid: string) {
        if (!uid) {
            throw new Error(`Did not specify a uid for text label removal. TextLabelController.removeFromPlayer`);
        }

        alt.emitClient(player, SYSTEM_EVENTS.REMOVE_TEXTLABEL, uid);
    }

    /**
     * Add a local text label to player.
     * @static
     * @param {alt.Player} player
     * @param {TextLabel} textLabel
     * @memberof TextLabelController
     */
    static addToPlayer(player: alt.Player, textLabel: TextLabel) {
        if (!textLabel.uid) {
            throw new Error(
                `Text Label ${JSON.stringify(textLabel.pos)} does not have a uid. TextLabelController.addToPlayer`
            );
        }

        alt.emitClient(player, SYSTEM_EVENTS.APPEND_TEXTLABELS, textLabel);
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
}
