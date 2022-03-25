import * as alt from 'alt-server';
import { PLAYER_SYNCED_META } from '../../../shared/enums/playerSynced';
import emit from './emit';
import save from './save';

/**
 * Safely set a player's position.
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @memberof SafePrototype
 */
function setPosition(player: alt.Player, x: number, y: number, z: number): void {
    if (!player.hasModel) {
        player.hasModel = true;
        player.spawn(x, y, z, 0);
        player.model = `mp_m_freemode_01`;
    }

    player.acPosition = new alt.Vector3(x, y, z);
    player.pos = new alt.Vector3(x, y, z);
}
/**
 * Safely add health to this player.
 * @param {number} value 99-199
 * @param {boolean} exactValue
 * @memberof SafePrototype
 */
function addHealth(p: alt.Player, value: number, exactValue: boolean = false) {
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
}

/**
 * Safely add armour to this player.
 * @param {number} value 1-100
 * @param {boolean} exactValue
 * @memberof SafePrototype
 */
function addArmour(p: alt.Player, value: number, exactValue: boolean = false): void {
    if (exactValue) {
        p.acArmour = value;
        p.armour = value;
        return;
    }

    if (p.armour + value > 100) {
        p.acArmour = 100;
        p.armour = 100;
        return;
    }

    p.acArmour = p.armour + value;
    p.armour = p.acArmour;
}

function setDimension(player: alt.Player, value: number) {
    player.dimension = value;
    player.setSyncedMeta(PLAYER_SYNCED_META.DIMENSION, value);
    alt.log(`Player Dimension is now: ${player.dimension}`);
}

function override(functionName: string, callback: (player: alt.Player, ...args: any[]) => void) {
    exports[functionName] = callback;
}

const exports = {
    addArmour,
    addHealth,
    override,
    setPosition,
    setDimension,
};

export default exports;
