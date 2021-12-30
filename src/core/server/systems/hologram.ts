import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Hologram } from '../../shared/interfaces/hologram';
import { sha256Random } from '../utility/encryption';

const holograms = [];

export class HologramController {
    /**
     * Add a Hologram to Render
     * @static
     * @param {Hologram} hologram
     * @returns {string} uid for hologram
     * @memberof HologramSystem
     */
    static add(hologram: Hologram): string {
        if (!hologram.identifier) {
            hologram.identifier = sha256Random(JSON.stringify(hologram));
        }

        holograms.push(hologram);
        return hologram.identifier;
    }

    /**
     * Remove a Hologram from the Hologram system by the indentifier.
     * @static
     * @param {string} identifier
     * @return {*}
     * @memberof HologramSystem
     */
    static remove(identifier: string) {
        const index = holograms.findIndex((x) => x.identifier === identifier);
        if (index <= -1) {
            return;
        }

        holograms.splice(index, 1);
    }

    static populateHolograms(player: alt.Player) {
        for (let i = 0; i < holograms.length; i++) {
            alt.emitClient(player, SYSTEM_EVENTS.HOLOGRAM_APPEND, holograms[i]);
        }
    }
}
