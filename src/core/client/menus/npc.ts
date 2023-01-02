import * as alt from 'alt-client';
import * as native from 'natives';
import { distance } from '@AthenaShared/utility/vector';
import { isAnyMenuOpen } from '@AthenaClient/utility/menus';
import { IWheelOptionExt } from '@AthenaShared/interfaces/wheelMenu';
import { WheelMenu } from '@AthenaClient/views/wheelMenu';
import { IPed } from '@AthenaShared/interfaces/iPed';
import { ClientPedController } from '@AthenaClient/streamers/ped';

type NpcMenuInjection = (scriptID: number, ped: IPed, options: Array<IWheelOptionExt>) => Array<IWheelOptionExt>;

const Injections: Array<NpcMenuInjection> = [];

const NpcWheelMenuConst = {
    /**
     * Allows the current Menu Options to be modified.
     * Meaning, a callback that will modify existing options, or append new options to the menu.
     * Must always return the original wheel menu options + your changes.
     *
     * @static
     * @param {NpcMenuInjection} callback
     * @memberof NpcWheelMenu
     */
    addInjection(callback: NpcMenuInjection) {
        Injections.push(callback);
    },

    /**
     * Opens the wheel menu against a target npc script id.
     *
     * @static
     * @param {number} scriptID
     * @return {*}
     * @memberof NpcWheelMenu
     */
    openMenu(scriptID: number): void {
        if (isAnyMenuOpen()) {
            return;
        }

        if (!native.isEntityAPed(scriptID)) {
            return;
        }

        const ped = ClientPedController.get(scriptID);
        console.log(JSON.stringify(ped));
        if (!ped) {
            return;
        }

        const coords = native.getEntityCoords(scriptID, false);
        const dist = distance(alt.Player.local.pos, coords);
        if (dist >= 5) {
            return;
        }

        let options: Array<IWheelOptionExt> = [];

        for (const callback of Injections) {
            try {
                options = callback(scriptID, ped, options);
            } catch (err) {
                console.warn(`Got NPC Menu Injection Error: ${err}`);
                continue;
            }
        }

        if (options.length <= 0) {
            return;
        }

        WheelMenu.open('NPC', options);
    }
}

export const NpcWheelMenu = {
    ...NpcWheelMenuConst
}