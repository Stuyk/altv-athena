import * as alt from 'alt-server';
import { PLAYER_SYNCED_META } from '../../../shared/enums/playerSynced';

const Safe = {
    /**
     * Safely set a player's position.
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @memberof SafePrototype
     */
    setPosition(player: alt.Player, x: number, y: number, z: number): void {
        if (!player.hasModel) {
            player.hasModel = true;
            player.spawn(x, y, z, 0);
            player.model = `mp_m_freemode_01`;
        }

        player.acPosition = new alt.Vector3(x, y, z);
        player.pos = new alt.Vector3(x, y, z);
    },
    /**
     * Safely add health to this player.
     * @param {number} value 99-199
     * @param {boolean} exactValue
     * @memberof SafePrototype
     */
    addHealth(p: alt.Player, value: number, exactValue: boolean = false) {
        if (exactValue) {
            p.acHealth = value;
            p.health = value;
            return;
        }

        if (p.health + value > 199) {
            p.acHealth = 199;
            p.health = 199;
            return;
        }

        p.acHealth = p.health + value;
        p.health = p.acHealth;
    },

    /**
     * Safely add armour to this player.
     * @param {number} value 1-100
     * @param {boolean} exactValue
     * @memberof SafePrototype
     */
    addArmour(player: alt.Player, value: number, exactValue: boolean = false): void {
        if (exactValue) {
            player.acArmour = value;
            player.armour = value;
            return;
        }

        if (player.armour + value > 100) {
            player.acArmour = 100;
            player.armour = 100;
            return;
        }

        player.acArmour = player.armour + value;
        player.armour = player.acArmour;
    },
    setDimension(player: alt.Player, value: number) {
        player.dimension = value;
        player.setSyncedMeta(PLAYER_SYNCED_META.DIMENSION, value);
        alt.log(`Player Dimension is now: ${player.dimension}`);
    },
};

/**
 * It allows you to override any function exported by the Safe module
 * @param {Key} functionName - The name of the function you want to override.
 * @param callback - The function that will be called when the event is triggered.
 */
function override<Key extends keyof typeof Safe>(functionName: Key, callback: typeof Safe[Key]): void {
    if (typeof exports[functionName] === 'undefined') {
        alt.logError(`Athena.player.safe does not provide an export named ${functionName}`);
    }

    exports[functionName] = callback;
}

const exports: typeof Safe & { override?: typeof override } = {
    ...Safe,
    override,
};

export default exports;
