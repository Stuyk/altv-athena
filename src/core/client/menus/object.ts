import * as alt from 'alt-client';
import * as native from 'natives';
import { distance } from '@AthenaShared/utility/vector';
import { isAnyMenuOpen } from '@AthenaClient/utility/menus';
import { IWheelOptionExt } from '@AthenaShared/interfaces/wheelMenu';
import { WheelMenu } from '@AthenaClient/views/wheelMenu';
import { GroundItem } from '@AthenaShared/interfaces/groundItem';

type ObjectMenuInjection = (
    modelHash: number,
    scriptID: number,
    options: Array<IWheelOptionExt>,
    item?: GroundItem,
) => Array<IWheelOptionExt>;

const Injections: Array<ObjectMenuInjection> = [];
const validHashes: Array<number> = [];

const ObjectWheelMenuConst = {
    /**
     * Allows the current Menu Options to be modified.
     * Meaning, a callback that will modify existing options, or append new options to the menu.
     * Must always return the original wheel menu options + your changes.
     *
     * @static
     * @param {ObjectMenuInjection} callback
     * @memberof ObjectWheelMenu
     */
    addInjection(callback: ObjectMenuInjection): void {
        Injections.push(callback);
    },

    /**
     * Allows to register a valid object hash
     *
     * @static
     * @param {number} objectHash
     * @memberof ObjectWheelMenu
     */
    registerObject(objectHash: number): void {
        validHashes.push(objectHash);
    },

    /**
     * Opens the wheel menu against a target npc script id.
     *
     * @static
     * @param {number} scriptID
     * @return {*}
     * @memberof ObjectWheelMenu
     */
    openMenu(scriptID: number, item?: GroundItem): void {
        if (isAnyMenuOpen()) {
            return;
        }

        if (!native.isEntityAnObject(scriptID)) {
            return;
        }

        const coords = native.getEntityCoords(scriptID, false);
        const dist = distance(alt.Player.local.pos, coords);
        if (dist >= 3) {
            return;
        }

        const hash = native.getEntityModel(scriptID);

        let options: Array<IWheelOptionExt> = [];

        for (const callback of Injections) {
            try {
                options = callback(hash, scriptID, options, item);
            } catch (err) {
                console.warn(`Got Object Menu Injection Error: ${err}`);
                continue;
            }
        }

        if (options.length <= 0) {
            return;
        }

        WheelMenu.open('Object', options);
    },

    /**
     * Check if an object is registered for interaction.
     *
     * @static
     * @param {number} modelHash
     * @return {*}
     * @memberof InteractionController
     */
    isModelValidObject(modelHash: number): boolean {
        const index = validHashes.findIndex((x) => `${x}` === `${modelHash}`);
        return index >= 0;
    },
};

export const ObjectWheelMenu = {
    ...ObjectWheelMenuConst,
};
