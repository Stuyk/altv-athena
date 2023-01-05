import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { Hologram } from '@AthenaShared/interfaces/hologram';
import { distance2d } from '@AthenaShared/utility/vector';
import { isAnyMenuOpen } from '@AthenaClient/utility/menus';
import { loadModel } from '@AthenaClient/utility/model';
import { Timer } from '@AthenaClient/utility/timers';

const MAX_HOLOGRAM_DISTANCE = 10;
const TIME_TO_CHECK_HOLOGRAMS = 1000 * 3; // 3s
const holograms: Array<Hologram> = [];
let isUpdating = false;
let interval;

export const HologramSystem = {
    /**
     * Initialize the Hologram Renderer Process
     * @static
     * @memberof HologramSystem
     */
    init() {
        if (interval) {
            Timer.clearInterval(interval);
        }

        interval = Timer.createInterval(HologramSystem.render, TIME_TO_CHECK_HOLOGRAMS, 'hologram.ts');
    },

    /**
     * Add a Hologram to Render
     * @static
     * @param {Hologram} hologram
     * @memberof HologramSystem
     */
    add(hologram: Hologram) {
        holograms.push(hologram);
    },

    /**
     * Remove a Hologram from the Hologram system by the indentifier.
     * @static
     * @param {string} identifier
     * @return {*}
     * @memberof HologramSystem
     */
    remove(identifier: string) {
        isUpdating = true;

        const index = holograms.findIndex((x) => x.identifier === identifier);
        if (index <= -1) {
            isUpdating = false;
            return;
        }

        if (holograms[index].clientRef) {
            native.deleteVehicle(holograms[index].clientRef);
        }

        holograms.splice(index, 1);
        isUpdating = false;
    },

    toggleVisibility(identifier: string, value: boolean) {
        const index = holograms.findIndex((x) => x.identifier === identifier);
        if (index <= -1) {
            return;
        }

        holograms[index].isHidden = value;
    },

    /**
     * Used to render the Holograms.
     * @static
     * @return {*}
     * @memberof HologramSystem
     */
    async render() {
        if (isAnyMenuOpen()) {
            return;
        }

        if (isUpdating) {
            return;
        }

        for (let i = 0; i < holograms.length; i++) {
            const hologram = holograms[i];

            if (!hologram.noMaxDistance) {
                const isInRange = distance2d(alt.Player.local.pos, hologram.position) <= MAX_HOLOGRAM_DISTANCE;

                // Don't display and hide holograms that are no close to the player.
                if (!isInRange || hologram.isHidden) {
                    if (hologram.clientRef) {
                        native.deleteEntity(hologram.clientRef);
                        hologram.clientRef = null;
                    }

                    continue;
                }
            }

            // Create and display the hologram.
            if (hologram.clientRef) {
                continue;
            }

            const hash = alt.hash(hologram.model);
            const didLoadModel = await loadModel(hash);

            if (!didLoadModel) {
                continue;
            }

            hologram.clientRef = native.createVehicle(
                hash,
                hologram.position.x,
                hologram.position.y,
                hologram.position.z,
                hologram.heading,
                false,
                false,
                false,
            );

            alt.nextTick(() => {
                native.freezeEntityPosition(hologram.clientRef, true);
                native.setEntityAlpha(hologram.clientRef, 150, false);
                native.setEntityInvincible(hologram.clientRef, true);
                native.setEntityCanBeDamaged(hologram.clientRef, false);
            });
        }
    },
};

alt.onServer(SYSTEM_EVENTS.TICKS_START, HologramSystem.init);
alt.onServer(SYSTEM_EVENTS.HOLOGRAM_APPEND, HologramSystem.add);
