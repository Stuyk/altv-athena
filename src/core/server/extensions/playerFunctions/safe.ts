import * as alt from 'alt-server';
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

/**
 * Add or Remove food from the player.
 * Use a negative number to remove food from the player.
 * @param {alt.Player} player
 * @param {number} value
 */
function addFood(player: alt.Player, value: number) {
    adjustAttribute(player, value, 'food');
}

/**
 * Add or Remove water from the player.
 * Use a negative number to remove water from the player.
 * @param {alt.Player} player
 * @param {number} value
 */
function addWater(player: alt.Player, value: number) {
    adjustAttribute(player, value, 'water');
}

function adjustAttribute(player: alt.Player, value: number, attributeName: string) {
    if (player.data[attributeName] === undefined || player.data[attributeName] === null) {
        player.data[attributeName] = 100;
    }

    player.data[attributeName] += value;

    if (player.data[attributeName] < 0) {
        player.data[attributeName] = 0;
    }

    if (player.data[attributeName] > 100) {
        player.data[attributeName] = 100;
    }

    emit.meta(player, attributeName, player.data[attributeName]);
    save.field(player, attributeName, player.data[attributeName]);
}

export default {
    addFood,
    addArmour,
    addHealth,
    addWater,
    setPosition
};
