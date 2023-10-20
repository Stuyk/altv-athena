import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api/index.js';
import { Appearance } from '@AthenaShared/interfaces/appearance.js';
import { CharacterSystem } from '@AthenaClient/systems/character.js';

let id: number;
let appearance: Appearance = null;
let pos: alt.IVector3;
let rot: alt.IVector3 | number;
let isUpdating: boolean = false;
let hidden: boolean = false;

/**
 * Used to create a single instance of a character pedestrian.
 * Mostly used for appearance editing and such.
 * Do not use it for anything else.
 *
 * @class Ped
 */
export const PedCharacter = {
    /**
     * Create a Temporary Character Pedestrian
     * @param {boolean} isMale
     * @param {alt.IVector3} pos A position in the world.
     * @param {(alt.IVector3 | number) = {x: 0, y: 0, z: 0}}
     * @return {Promise<void>}
     *
     */
    async create(
        isMale: boolean,
        _pos: alt.IVector3,
        _rot: alt.IVector3 | number = { x: 0, y: 0, z: 0 },
    ): Promise<number> {
        pos = _pos;
        rot = _rot;
        hidden = false;

        await PedCharacter.destroy();

        const model = isMale ? 'mp_m_freemode_01' : 'mp_f_freemode_01';
        const hash = alt.hash(model);
        await AthenaClient.utility.model.load(hash);
        id = native.createPed(1, hash, _pos.x, _pos.y, _pos.z, 0, false, false);

        return new Promise(async (resolve: Function) => {
            alt.nextTick(() => {
                native.setEntityNoCollisionEntity(id, alt.Player.local.scriptID, false);
                native.taskSetBlockingOfNonTemporaryEvents(id, true);
                native.setBlockingOfNonTemporaryEvents(id, true);
                native.setPedFleeAttributes(id, 0, true);
                native.setPedCombatAttributes(id, 17, true);
                native.setPedAsEnemy(id, false);
                native.setEntityInvincible(id, true);
                native.freezeEntityPosition(id, true);

                if (typeof _rot === 'object') {
                    native.setEntityRotation(id, _rot.x, _rot.y, _rot.z, 1, false);
                } else {
                    native.setEntityHeading(id, _rot);
                }

                native.setEntityCoordsNoOffset(id, _pos.x, _pos.y, _pos.z, false, false, false);
                return resolve(id);
            });
        });
    },

    /**
     * Apply pedestrian appearance data.
     * @static
     * @param {Appearance} appearance
     * @param {boolean} forceSameShoes Set to true to make female / male switching equal height.
     *
     */
    async apply(_appearance: Appearance, forceSameShoes = false): Promise<void> {
        if (isUpdating) {
            return;
        }

        isUpdating = true;

        if (!appearance || (appearance && appearance.sex !== _appearance.sex)) {
            await PedCharacter.destroy();
            await PedCharacter.create(_appearance.sex === 1 ? true : false, pos, rot);
        }

        if (forceSameShoes) {
            native.setPedComponentVariation(id, 6, 1, 0, 0);
        }

        await CharacterSystem.applyAppearance(id, _appearance);

        appearance = _appearance;
        isUpdating = false;
    },

    getApperance(): Appearance | null {
        return appearance;
    },

    /**
     * Get the pedestrian id.
     * @static
     * @return {number}
     *
     */
    get(): number {
        if (id === undefined || id === null) {
            return -1;
        }

        return id;
    },

    /**
     * Hide this pedestrian
     * @static
     * @param {boolean} value
     *
     */
    setHidden(value: boolean) {
        hidden = value;

        if (hidden && id && native.doesEntityExist(id)) {
            native.setEntityVisible(id, false, false);
        }

        if (!hidden && id && native.doesEntityExist(id)) {
            native.setEntityVisible(id, true, false);
        }
    },

    /**
     * Destroy the pedestrian character.
     * Does not clear previous position or rotation.
     * @static
     *
     */
    async destroy() {
        return new Promise((resolve: Function) => {
            let attempts = 0;
            const interval = alt.setInterval(() => {
                if (id === undefined || id === null) {
                    alt.clearInterval(interval);
                    return resolve();
                }

                if (!native.doesEntityExist(id)) {
                    id = null;
                    alt.clearInterval(interval);
                    return resolve();
                }

                if (attempts >= 10) {
                    id = null;
                    alt.clearInterval(interval);
                    return resolve();
                }

                native.deletePed(id);
                native.deleteEntity(id);
                attempts += 1;
            }, 100);
        });
    },
};

alt.on('disconnect', PedCharacter.destroy);
