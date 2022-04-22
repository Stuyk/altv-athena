import * as alt from 'alt-server';
import EFFECT from '../../../../shared/enums/effects';
import { ItemEffects } from '../../../../server/systems/itemEffects';
import { VITAL_NAMES } from '../enums';
import { Item } from '../../../../shared/interfaces/item';
import { VitalsSystem } from './system';
import IAttachable from '../../../../shared/interfaces/iAttachable';
import { ANIMATION_FLAGS } from '../../../../shared/flags/animationFlags';
import { Athena } from '../../../../server/api/athena';

export class InternalFunctions {
    /**
     * When the player eats or drinks, the player's vital is adjusted by the amount of the item.
     * An animation or a sound is also played dependent on the data passed inside of the item itself.
     *
     * @param player - alt.Player - The player who is receiving the item.
     * @param {Item} item - Item - The item that was consumed.
     * @param {VITAL_NAMES} vitalsName - The name of the vital that was changed.
     */
    static handleVitalsChange(player: alt.Player, item: Item, vitalsName: VITAL_NAMES) {
        VitalsSystem.adjustVital(player, vitalsName, item.data.amount);
        Athena.player.inventory.notify(player, `+${item.data.amount} ${vitalsName}`);

        if (item.data.sound) {
            Athena.player.emit.sound3D(player, item.data.sound, player);
        }

        if (vitalsName === VITAL_NAMES.FOOD) {
            const attachedObject: IAttachable = {
                model: 'prop_cs_burger_01',
                bone: 57005,
                pos: { x: 0.15, y: -0.02, z: -0.05 },
                rot: { x: -180, y: -150, z: -95 },
            };

            Athena.player.emit.objectAttach(player, attachedObject, 6000);
            Athena.player.emit.animation(
                player,
                'amb@code_human_wander_eating_donut@male@idle_a',
                'idle_c',
                ANIMATION_FLAGS.UPPERBODY_ONLY | ANIMATION_FLAGS.ENABLE_PLAYER_CONTROL,
                6000,
            );
        }

        if (vitalsName === VITAL_NAMES.WATER) {
            const attachedObject: IAttachable = {
                model: 'prop_beer_bottle',
                bone: 57005,
                pos: { x: 0.13, y: -0.12, z: -0.05 },
                rot: { x: 100, y: -220, z: 180 },
            };

            Athena.player.emit.objectAttach(player, attachedObject, 5000);
            Athena.player.emit.animation(
                player,
                'amb@world_human_drinking@beer@male@idle_a',
                'idle_c',
                ANIMATION_FLAGS.UPPERBODY_ONLY | ANIMATION_FLAGS.ENABLE_PLAYER_CONTROL,
                5000,
            );
        }
    }
}

export class VitalsEffects {
    /**
     * It adds an effect to the item that will change the player's vitals when the item is consumed.
     */
    static init() {
        ItemEffects.add(EFFECT.EFFECT_FOOD, (player: alt.Player, item: Item) => {
            if (!item || !item.data || !item.data.amount) {
                return;
            }

            InternalFunctions.handleVitalsChange(player, item, VITAL_NAMES.FOOD);
        });

        ItemEffects.add(EFFECT.EFFECT_WATER, (player: alt.Player, item: Item) => {
            if (!item || !item.data || !item.data.amount) {
                return;
            }

            InternalFunctions.handleVitalsChange(player, item, VITAL_NAMES.WATER);
        });
    }
}
