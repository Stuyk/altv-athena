import * as alt from 'alt-server';
import { PLAYER_SYNCED_META } from '@AthenaShared/enums/playerSynced';
import { Athena } from '@AthenaServer/api/athena';

const Safe = {
    /**
     * Safely set a player's position.
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @memberof SafePrototype
     */
    setPosition(player: alt.Player, x: number, y: number, z: number, doNotInvokeEventCall = false): void {
        if (!doNotInvokeEventCall) {
            Athena.events.player.trigger('player-pos-set', player, player.pos);
        }

        if (!player.hasModel) {
            player.hasModel = true;
            player.spawn(x, y, z, 0);
            player.model = `mp_m_freemode_01`;
        }

        const pos = new alt.Vector3(x, y, z);
        if (player.vehicle && player.vehicle.driver === player) {
            player.vehicle.pos = pos;
        } else {
            player.pos = pos;
        }
    },
    /**
     * Safely add health to this player.
     * @param {alt.Player} player
     * @param {number} value 99-199
     * @param {boolean} exactValue
     * @memberof SafePrototype
     */
    addHealth(player: alt.Player, value: number, exactValue: boolean = false, doNotInvokeEventCall = false) {
        if (!doNotInvokeEventCall) {
            Athena.events.player.trigger('player-health-set', player, player.health);
        }

        if (exactValue) {
            player.health = value;
            return;
        }

        if (player.health + value > 199) {
            player.health = 199;
            return;
        }

        player.health = player.health + value;
    },

    /**
     * Safely subtract health to this player.
     * @param {alt.Player} player
     * @param {number} value 99-199
     * @param {boolean} exactValue
     * @memberof SafePrototype
     */
    subHealth(player: alt.Player, value: number, exactValue: boolean = false, doNotInvokeEventCall = false) {
        if (!doNotInvokeEventCall) {
            Athena.events.player.trigger('player-health-set', player, player.health);
        }

        if (exactValue) {
            player.health = value;
            return;
        }

        if (player.health - value < 0) {
            player.health = 0;
            return;
        }

        player.health = player.health - value;
    },

    /**
     * Safely add armour to this player.
     * @param {number} value 1-100
     * @param {boolean} exactValue
     * @memberof SafePrototype
     */
    addArmour(player: alt.Player, value: number, exactValue: boolean = false, doNotInvokeEventCall = false): void {
        if (!doNotInvokeEventCall) {
            Athena.events.player.trigger('player-armour-set', player, player.armour);
        }

        if (exactValue) {
            player.armour = value;
            return;
        }

        if (player.armour + value > 100) {
            player.armour = 100;
            return;
        }

        player.armour = player.armour + value;
    },

    /**
     * Safely subtracts armour to this player.
     * @param {number} value 1-100
     * @param {boolean} exactValue
     * @memberof SafePrototype
     */
    subArmour(player: alt.Player, value: number, exactValue: boolean = false, doNotInvokeEventCall = false): void {
        if (!doNotInvokeEventCall) {
            Athena.events.player.trigger('player-armour-set', player, player.armour);
        }

        if (exactValue) {
            player.armour = value;
            return;
        }

        if (player.armour - value < 100) {
            player.armour = 0;
            return;
        }

        player.armour = player.armour - value;
    },
    setDimension(player: alt.Player, value: number) {
        player.dimension = value;
        player.setSyncedMeta(PLAYER_SYNCED_META.DIMENSION, value);
    },
};

/**
 * It allows you to override any function exported by the Safe module
 * @param {Key} functionName - The name of the function you want to override.
 * @param callback - The function that will be called when the event is triggered.
 */
function override<Key extends keyof typeof Safe>(functionName: Key, callback: typeof Safe[Key]): void {
    if (typeof funcs[functionName] === 'undefined') {
        alt.logError(`Athena.player.safe does not provide an export named ${functionName}`);
    }

    funcs[functionName] = callback;
}

const funcs: typeof Safe & { override?: typeof override } = {
    ...Safe,
    override,
};

export default funcs;
