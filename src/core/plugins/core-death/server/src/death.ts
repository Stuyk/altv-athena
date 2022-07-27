import * as alt from 'alt-server';
import { IVector3 } from 'alt-shared';
import { Athena } from '../../../../server/api/athena';
import { PlayerEvents } from '../../../../server/events/playerEvents';
import { Identifier } from '../../../../server/systems/identifier';
import { StateManager } from '../../../../server/systems/stateManager';
import { ATHENA_EVENTS_PLAYER } from '../../../../shared/enums/athenaEvents';
import { distance2d } from '../../../../shared/utility/vector';
import { DEATH_EVENTS } from '../../shared/events';
import { DEATH_CONFIG } from './config';

const TimeOfDeath: { [_id: string]: number } = {};

export class DeathSystem {
    static init() {
        PlayerEvents.on(ATHENA_EVENTS_PLAYER.SPAWNED, DeathSystem.handleCharacterRespawn);
        PlayerEvents.on(ATHENA_EVENTS_PLAYER.DIED, DeathSystem.handleDeath);
        PlayerEvents.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, DeathSystem.handleCharacterSelect);
    }

    /**
     * This is a server-side time in the future for the given player.
     *
     * It will return undefined / null if it's not set.
     *
     * @static
     * @memberof DeathSystem
     */
    static getRespawnTime(player: alt.Player): number | undefined {
        if (!player || !player.valid || !player.hasFullySpawned) {
            return undefined;
        }

        if (!TimeOfDeath[player.data._id.toString()]) {
            return undefined;
        }

        return TimeOfDeath[player.data._id.toString()];
    }

    /**
     * Used to clear stored respawn time.
     *
     * @static
     * @param {alt.Player} player
     * @memberof DeathSystem
     */
    static clearRespawnTime(player: alt.Player) {
        delete TimeOfDeath[player.data._id.toString()];
    }

    /**
     * Called when the player is invoked with a respawn.
     *
     * @private
     * @static
     * @param {alt.Player} player
     * @param {IVector3} [position=undefined]
     * @memberof DeathSystem
     */
    private static handleCharacterRespawn(player: alt.Player, position: IVector3 = undefined) {
        let nearestHopsital = position;
        if (!position) {
            const hospitals = [...DEATH_CONFIG.HOSPITALS];
            let index = 0;
            let lastDistance = distance2d(player.pos, hospitals[0]);

            for (let i = 1; i < hospitals.length; i++) {
                const dist = distance2d(player.pos, hospitals[i]);
                if (dist > lastDistance) {
                    continue;
                }

                lastDistance = dist;
                index = i;
            }

            nearestHopsital = hospitals[index] as alt.Vector3;

            if (DEATH_CONFIG.LOSE_ALL_WEAPONS_ON_RESPAWN) {
                Athena.player.inventory.removeAllWeapons(player);
            }
        }

        Athena.player.safe.setPosition(player, nearestHopsital.x, nearestHopsital.y, nearestHopsital.z);
        player.spawn(nearestHopsital.x, nearestHopsital.y, nearestHopsital.z, 0);

        alt.nextTick(() => {
            player.clearBloodDamage();
            Athena.player.safe.addHealth(player, DEATH_CONFIG.RESPAWN_HEALTH, true);
            Athena.player.safe.addArmour(player, DEATH_CONFIG.RESPAWN_ARMOUR, true);
            DeathSystem.clearRespawnTime(player);
        });
    }

    /**
     * Verifies information about player health after selecting character.
     * Sets them to a dead state if they haven't served their death sentence.
     *
     * @private
     * @static
     * @param {alt.Player} player
     * @memberof DeathSystem
     */
    private static handleCharacterSelect(player: alt.Player) {
        if (player.data.health <= 99) {
            const id = Identifier.getIdByStrategy(player);
            alt.log(`(${id}) ${player.data.name} has died.`);

            try {
                StateManager.set(player, 'isDead', true);
                PlayerEvents.trigger(ATHENA_EVENTS_PLAYER.DIED, player);
            } catch (err) {
                alt.logError(err);
                alt.log(`Could not set player ${player.data.name} to dead.`);
            }
        }

        if (!player.data.isDead) {
            Athena.player.emit.meta(player, 'isDead', false);
        }

        if (player.data.isDead) {
            Athena.player.emit.meta(player, 'isDead', true);
    
            if (!TimeOfDeath[player.data._id.toString()]) {
                TimeOfDeath[player.data._id.toString()] = Date.now() + DEATH_CONFIG.RESPAWN_TIME;
            }

            alt.emitClient(
                player,
                DEATH_EVENTS.UPDATE_DEATH_TIMER_MS,
                TimeOfDeath[player.data._id.toString()] - Date.now(),
            );
        }
    }

    /**
     * Called when the player has died.
     *
     * @private
     * @static
     * @param {alt.Player} player
     * @param {*} [weaponHash=null]
     * @return {void}
     * @memberof DeathSystem
     */
    private static handleDeath(player: alt.Player, weaponHash: any = null): void {
        if (!player || !player.valid) {
            return;
        }

        player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);
        Athena.player.emit.meta(player, 'isDead', true);

        if (!TimeOfDeath[player.data._id.toString()]) {
            TimeOfDeath[player.data._id.toString()] = Date.now() + DEATH_CONFIG.RESPAWN_TIME;
        }

        alt.emitClient(
            player,
            DEATH_EVENTS.UPDATE_DEATH_TIMER_MS,
            TimeOfDeath[player.data._id.toString()] - Date.now(),
        );
    }
}
