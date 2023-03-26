import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import '@AthenaServer/systems/streamer';

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
     * @param {alt.Player} player An alt:V Player Entity
     * @param {Array<TextLabel>} labels
     * @memberof InternalController
     */
    update(player: alt.Player, labels: Array<TextLabel>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_TEXTLABELS, labels);
    },
};

/**
 * Adds a text label to the global streamer.
 *
 * Returns a uid or generates one if not specified.
 *
 * @example
 * ```ts
 * const uid = Athena.controllers.textLabel.append({ text: 'Hello World!', pos: { x: 0, y: 0, z: 0 }});
 *
 * Athena.controllers.textLabel.append({ uid: 'uid-you-specify', text: 'Hello World!', pos: { x: 0, y: 0, z: 0 }});
 * ```
 *
 * @param {TextLabel} label
 * @returns {string} uid A unique string for removal
 */
export function append(label: TextLabel): string {
    if (Overrides.append) {
        return Overrides.append(label);
    }

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
 *
 * Not defining the player tries to update the label globally.
 *
 * Try not to perfrom this updates in an everyTick, and only update text labels.
 *
 * Specify player as the last parameter to update their instance; otherwise updates all players if uid matches.
 *
 * @example
 * ```ts
 * Athena.controllers.textLabel.update(someUid, { text: 'Hello World!' });
 *
 * Athena.controllers.textLabel.update('uid-you-specify', { text: 'Hello World!' });
 *
 * Athena.controllers.textLabel.update('uid-you-specify', { text: 'Hello World!' }, somePlayer);
 * ```
 *
 * @param {string} uid A unique string
 * @param {alt.Player} [player=undefined]
 * @memberof ServerTextLabelController
 */
export function update(uid: string, label: Partial<TextLabel>, player: alt.Player = undefined): boolean {
    if (Overrides.update) {
        return Overrides.update(uid, label, player);
    }

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
 *
 * @example
 * ```ts
 * Athena.controllers.textLabel.remove(someUid);
 *
 * Athena.controllers.textLabel.remove('uid-you-specify');
 * ```
 *
 * @param {string} uid A unique string
 * @return {boolean}
 */
export function remove(uid: string): boolean {
    if (Overrides.remove) {
        return Overrides.remove(uid);
    }

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
 *
 * @example
 * ```ts
 * Athena.controllers.textLabel.removeFromPlayer(somePlayer, someUid);
 *
 * Athena.controllers.textLabel.removeFromPlayer(somePlayer, 'uid-you-specify');
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {string} uid A unique string
 */
export function removeFromPlayer(player: alt.Player, uid: string) {
    if (Overrides.removeFromPlayer) {
        return Overrides.removeFromPlayer(player, uid);
    }

    if (!uid) {
        throw new Error(`Did not specify a uid for text label removal. TextLabelController.removeFromPlayer`);
    }

    alt.emitClient(player, SYSTEM_EVENTS.REMOVE_TEXTLABEL, uid);
}

/**
 * Add a local text label to player.
 *
 * @example
 * ```ts
 * const uid = Athena.controllers.textLabel.addToPlayer(somePlayer, { text: 'Hello World!', pos: { x: 0, y: 0, z: 0 }});
 *
 * Athena.controllers.textLabel.addToPlayer(somePlayer, { uid: 'uid-you-specify', text: 'Hello World!', pos: { x: 0, y: 0, z: 0 }});
 * ```
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @param {TextLabel} textLabel
 * @returns {string} uid A unique string for removal
 */
export function addToPlayer(player: alt.Player, textLabel: TextLabel): string {
    if (Overrides.addToPlayer) {
        return Overrides.addToPlayer(player, textLabel);
    }

    if (!textLabel.uid) {
        textLabel.uid = Athena.utility.hash.sha256Random(JSON.stringify(textLabel));
    }

    textLabel.isServerWide = false;
    alt.emitClient(player, SYSTEM_EVENTS.APPEND_TEXTLABELS, textLabel);
    return textLabel.uid;
}

Athena.systems.plugins.addCallback(InternalController.init);

type TextLabelFuncs = ControllerFuncs<
    typeof append,
    typeof remove,
    typeof addToPlayer,
    typeof removeFromPlayer,
    typeof update
>;

const Overrides: Partial<TextLabelFuncs> = {};

export function override(functionName: 'append', callback: typeof append);
export function override(functionName: 'remove', callback: typeof remove);
export function override(functionName: 'addToPlayer', callback: typeof addToPlayer);
export function override(functionName: 'removeFromPlayer', callback: typeof removeFromPlayer);
export function override(functionName: 'update', callback: typeof update);
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
