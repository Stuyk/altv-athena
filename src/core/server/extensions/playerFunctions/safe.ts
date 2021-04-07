import * as alt from 'alt-server';
import { AresFunctions, WASM } from '../../utility/wasmLoader';

const wasm = WASM.getFunctions<AresFunctions>('ares');

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
 * @param {number} value 99-200
 * @param {boolean} exactValue
 * @memberof SafePrototype
 */
function addHealth(p: alt.Player, value: number, exactValue: boolean = false) {
    if (exactValue) {
        p.acHealth = value;
        p.health = value;
        return;
    }

    if (wasm.AthenaMath.add(p.health, value) > 199) {
        p.acHealth = 199;
        p.health = 199;
        return;
    }

    p.acHealth = wasm.AthenaMath.add(p.health, value);
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

    if (wasm.AthenaMath.add(p.armour, value) > 100) {
        p.acArmour = 100;
        p.armour = 100;
        return;
    }

    p.acArmour = wasm.AthenaMath.add(p.armour, value);
    p.armour = p.acArmour;
}

export default {
    addArmour,
    addHealth,
    setPosition
};
