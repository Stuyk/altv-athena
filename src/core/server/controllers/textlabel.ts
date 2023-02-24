import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { TextLabel } from '../../shared/interfaces/textLabel';

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
        Athena.systems.streamer.registerCallback(KEY, InternalController.update);
    },

    /**
     * Internal function to refresh all global text labels in the streamer service.
     * @memberof InternalController
     */
    refresh() {
        Athena.systems.streamer.updateData(KEY, globalTextLabels);
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

/**
 * Adds a text label to the global streamer.
 * @param {TextLabel} label
 * @returns {string} uid for removal
 */
export function append(label: TextLabel): string {
    if (!label.uid) {
        label.uid = Athena.utility.hash.sha256Random(JSON.stringify(label));
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
}

/**
 * Update a text label globally, or for a player.
 * Not defining the player tries to update the label globally.
 * Try not to perfrom this updates in an everyTick, and only update text labels.
 *
 * @param {string} uid
 * @param {alt.Player} [player=undefined]
 * @memberof ServerTextLabelController
 */
export function update(uid: string, label: Partial<TextLabel>, player: alt.Player = undefined): boolean {
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
}

/**
 * Removes a text label based on uid from the global streamer
 * @param {string} uid
 * @return {boolean}
 */
export function remove(uid: string): boolean {
    const index = globalTextLabels.findIndex((label) => label.uid === uid);
    if (index <= -1) {
        return false;
    }

    globalTextLabels.splice(index, 1);
    InternalController.refresh();
    return true;
}

/**
 * Remove a local text label from a player.
 * @param {alt.Player} player
 * @param {string} uid
 */
export function removeFromPlayer(player: alt.Player, uid: string) {
    if (!uid) {
        throw new Error(`Did not specify a uid for text label removal. TextLabelController.removeFromPlayer`);
    }

    alt.emitClient(player, SYSTEM_EVENTS.REMOVE_TEXTLABEL, uid);
}

/**
 * Add a local text label to player.
 * @param {alt.Player} player
 * @param {TextLabel} textLabel
 * @returns {string} uid for removal
 */
export function addToPlayer(player: alt.Player, textLabel: TextLabel): string {
    if (!textLabel.uid) {
        textLabel.uid = Athena.utility.hash.sha256Random(JSON.stringify(textLabel));
    }

    textLabel.isServerWide = false;
    alt.emitClient(player, SYSTEM_EVENTS.APPEND_TEXTLABELS, textLabel);
    return textLabel.uid;
}

InternalController.init();

type TextLabelFuncs = ControllerFuncs<typeof append, typeof remove, typeof addToPlayer, typeof removeFromPlayer>;

const Overrides: Partial<TextLabelFuncs> = {};

export function override(functionName: 'append', callback: typeof append);
export function override(functionName: 'remove', callback: typeof remove);
export function override(functionName: 'addToPlayer', callback: typeof addToPlayer);
export function override(functionName: 'removeFromPlayer', callback: typeof removeFromPlayer);
/**
 * Used to override any text label streamer functionality
 *
 * @export
 * @param {keyof TextLabelFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof TextLabelFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
