import * as alt from 'alt-server';

/**
 * Safely set a player's position.
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @memberof SafePrototype
 */
function setPosition(p: alt.Player, x: number, y: number, z: number): void {
    if (!p.hasModel) {
        p.hasModel = true;
        p.spawn(x, y, z, 0);
        p.model = `mp_m_freemode_01`;
    }

    p.acPosition = new alt.Vector3(x, y, z);
    p.pos = new alt.Vector3(x, y, z);
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

    if (p.health + value > 200) {
        p.acHealth = 200;
        p.health = 200;
        return;
    }

    p.acHealth = p.health + value;
    p.health += value;
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
    p.armour += value;
}

export default {
    addArmour,
    addHealth,
    setPosition
};
