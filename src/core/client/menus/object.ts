import * as alt from 'alt-client';
import * as native from 'natives';
import { distance } from '../../shared/utility/vector';
import { isAnyMenuOpen } from '../utility/menus';
import { IWheelOptionExt } from '../../shared/interfaces/wheelMenu';
import { WheelMenu } from '../views/wheelMenu';

type ObjectMenuInjection = (
    modelHash: number,
    scriptID: number,
    options: Array<IWheelOptionExt>,
) => Array<IWheelOptionExt>;

const Injections: Array<ObjectMenuInjection> = [];
const validHashes: Array<number> = [];

export class ObjectWheelMenu {
    /**
     * Allows the current Menu Options to be modified.
     * Meaning, a callback that will modify existing options, or append new options to the menu.
     * Must always return the original wheel menu options + your changes.
     *
     * @static
     * @param {ObjectMenuInjection} callback
     * @memberof ObjectWheelMenu
     */
    static addInjection(callback: ObjectMenuInjection) {
        Injections.push(callback);
    }

    /**
     * Allows to register a valid object hash
     *
     * @static
     * @param {number} objectHash
     * @memberof ObjectWheelMenu
     */
    static registerObject(objectHash: number) {
        validHashes.push(objectHash);
    }

    /**
     * Opens the wheel menu against a target npc script id.
     *
     * @static
     * @param {number} scriptID
     * @return {*}
     * @memberof ObjectWheelMenu
     */
    static openMenu(scriptID: number) {
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
                options = callback(hash, scriptID, options);
            } catch (err) {
                console.warn(`Got Object Menu Injection Error: ${err}`);
                continue;
            }
        }

        if (options.length <= 0) {
            return;
        }

        WheelMenu.open('Object', options);
    }

    /**
     * Check if an object is registered for interaction.
     *
     * @static
     * @param {number} modelHash
     * @return {*}
     * @memberof InteractionController
     */
    static isModelValidObject(modelHash: number) {
        const index = validHashes.findIndex((x) => `${x}` === `${modelHash}`);
        return index >= 0;
    }
}
