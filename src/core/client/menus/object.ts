import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api';

import { IWheelOptionExt } from '../../shared/interfaces/wheelMenu';
import { CreatedObject } from '@AthenaClient/streamers/object';

export type ObjectMenuInjection = (
    existingObject: CreatedObject,
    options: Array<IWheelOptionExt>,
) => Array<IWheelOptionExt>;

const Injections: Array<ObjectMenuInjection> = [];

/**
 * Allows the current Menu Options to be modified.
 * Meaning, a callback that will modify existing options, or append new options to the menu.
 * Must always return the original wheel menu options + your changes.
 *
 * @static
 * @param {ObjectMenuInjection} callback
 *
 */
export function addInjection(callback: ObjectMenuInjection): void {
    Injections.push(callback);
}

/**
 * Opens the wheel menu against a target object created with the server-side object api
 *
 * @static
 * @param {CreatedObject} scriptID
 * @return {void}
 *
 */
export function open(object: CreatedObject): void {
    if (AthenaClient.webview.isAnyMenuOpen()) {
        return;
    }

    if (!object.createdObject) {
        return;
    }

    if (!native.isEntityAnObject(object.createdObject.scriptID)) {
        return;
    }

    const coords = native.getEntityCoords(object.createdObject.scriptID, false);
    const dist = AthenaClient.utility.vector.distance(alt.Player.local.pos, coords);
    if (dist >= 3) {
        return;
    }

    let options: Array<IWheelOptionExt> = [];

    for (const callback of Injections) {
        try {
            options = callback(object, options);
        } catch (err) {
            console.warn(`Got Object Menu Injection Error: ${err}`);
            continue;
        }
    }

    // Used to debug if the item showed up correctly
    // options.push({ name: `${object.model}` });

    if (options.length <= 0) {
        return;
    }

    AthenaClient.systems.wheelMenu.open('Object', options);
}
