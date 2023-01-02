import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { TextLabel } from '@AthenaShared/interfaces/textLabel';
import { sha256Random } from '@AthenaServer/utility/encryption';
import { StreamerService } from '@AthenaServer/systems/streamer';

const globalTextLabels: Array<TextLabel> = [];
const KEY = 'labels';

/**
 * Should not be exported. Do not export.
 * @class InternalController
 */
const InternalController = {
    /**
     * Initialize the TextLabel Streamer Service
     * @memberof InternalController
     */
    init() {
        StreamerService.registerCallback(KEY, InternalController.update);
    },

    /**
     * Internal function to refresh all global text labels in the streamer service.
     * @memberof InternalController
     */
    refresh() {
        StreamerService.updateData(KEY, globalTextLabels);
    },

    /**
     * Updates text labels through the streamer service.
     * @param {alt.Player} player
     * @param {Array<TextLabel>} labels
     * @memberof InternalController
     */
    update(player: alt.Player, labels: Array<TextLabel>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_TEXTLABELS, labels);
    },
};

const ServerTextLabelControllerConst = {
    /**
     * Adds a text label to the global streamer.
     * @param {TextLabel} label
     * @returns {string} uid for removal
     * @memberof TextLabelController
     */
    append(label: TextLabel): string {
        if (!label.uid) {
            label.uid = sha256Random(JSON.stringify(label));
        }

        const index = globalTextLabels.findIndex((x) => x.uid === label.uid);
        if (index !== -1) {
            alt.logWarning(`Text Label with uid ${label.uid} already exists. If trying to update use update function.`);
            return undefined;
        }

        label.isServerWide = true;
        globalTextLabels.push(label);
        InternalController.refresh();
        return label.uid;
    },

    /**
     * Update a text label globally, or for a player.
     * Not defining the player tries to update the label globally.
     * Try not to perfrom this updates in an everyTick, and only update text labels.
     *
     * @param {string} uid
     * @param {alt.Player} [player=undefined]
     * @memberof ServerTextLabelController
     */
    update(uid: string, label: Partial<TextLabel>, player: alt.Player = undefined): boolean {
        if (typeof player === 'undefined') {
            const index = globalTextLabels.findIndex((x) => x.uid === uid);
            if (index === -1) {
                alt.logWarning(`Could not update global text that does not exist. UID: ${uid}`);
                return undefined;
            }

            globalTextLabels[index] = { ...globalTextLabels[index], ...label, uid };
            InternalController.refresh();
            return true;
        }

        label.isServerWide = false;
        alt.emitClient(player, SYSTEM_EVENTS.UPDATE_TEXT_LABEL, { ...label, uid });
        return true;
    },

    /**
     * Removes a text label based on uid from the global streamer
     * @param {string} uid
     * @return {boolean}
     * @memberof TextLabelController
     */
    remove(uid: string): boolean {
        const index = globalTextLabels.findIndex((label) => label.uid === uid);
        if (index <= -1) {
            return false;
        }

        globalTextLabels.splice(index, 1);
        InternalController.refresh();
        return true;
    },

    /**
     * Remove a local text label from a player.
     * @param {alt.Player} player
     * @param {string} uid
     * @memberof TextLabelController
     */
    removeFromPlayer(player: alt.Player, uid: string) {
        if (!uid) {
            throw new Error(`Did not specify a uid for text label removal. TextLabelController.removeFromPlayer`);
        }

        alt.emitClient(player, SYSTEM_EVENTS.REMOVE_TEXTLABEL, uid);
    },

    /**
     * Add a local text label to player.
     * @param {alt.Player} player
     * @param {TextLabel} textLabel
     * @returns {string} uid for removal
     * @memberof TextLabelController
     */
    addToPlayer(player: alt.Player, textLabel: TextLabel): string {
        if (!textLabel.uid) {
            textLabel.uid = sha256Random(JSON.stringify(textLabel));
        }

        textLabel.isServerWide = false;
        alt.emitClient(player, SYSTEM_EVENTS.APPEND_TEXTLABELS, textLabel);
        return textLabel.uid;
    },
};

export const ServerTextLabelController = {
    ...ServerTextLabelControllerConst,
};

InternalController.init();
