import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/System';
import { TextLabel } from '../../shared/interfaces/TextLabel';
import { sha256Random } from '../utility/encryption';
import { StreamerService } from '../systems/streamer';

const globalTextLabels: Array<TextLabel> = [];
const KEY = 'labels';

export class ServerTextLabelController {
    /**
     * Initialize the TextLabel Streamer Service
     * @static
     * @memberof TextLabelController
     */
    static init() {
        StreamerService.registerCallback(KEY, ServerTextLabelController.update);
    }

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
     * @returns {string} uid for removal
     * @memberof TextLabelController
     */
    static append(label: TextLabel): string {
        if (!label.uid) {
            label.uid = sha256Random(JSON.stringify(label));
        }

        globalTextLabels.push(label);
        ServerTextLabelController.refresh();
        return label.uid;
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
        ServerTextLabelController.refresh();
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
     * @returns {string} uid for removal
     * @memberof TextLabelController
     */
    static addToPlayer(player: alt.Player, textLabel: TextLabel): string {
        if (!textLabel.uid) {
            textLabel.uid = sha256Random(JSON.stringify(textLabel));
        }

        alt.emitClient(player, SYSTEM_EVENTS.APPEND_TEXTLABELS, textLabel);
        return textLabel.uid;
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

ServerTextLabelController.init();
