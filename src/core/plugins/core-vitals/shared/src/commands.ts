import * as alt from 'alt-server';
import ChatController from '../../../../server/systems/chat';
import { VITAL_NAMES } from '../enums';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';
import { VitalsSystem } from './system';
import { Athena } from '../../../../server/api/athena';

class InternalCommands {
    /**
     * Command handler to set water.
     *
     * @static
     * @param {alt.Player} player
     * @param {string} commandValue
     * @return {*}  {void}
     * @memberof VitalsCommands
     */
    static setWater(player: alt.Player, commandValue: string): void {
        let value = parseInt(commandValue);

        if (isNaN(value)) {
            Athena.player.emit.message(player, ChatController.getDescription('setwater'));
            return;
        }

        value = VitalsSystem.normalizeVital(value);
        VitalsSystem.adjustVital(player, VITAL_NAMES.WATER, value, true);
    }

    /**
     * Command handler to set food.
     *
     * @static
     * @param {alt.Player} player
     * @param {string} commandValue
     * @return {*}  {void}
     * @memberof VitalsCommands
     */
    static setFood(player: alt.Player, commandValue: string): void {
        let value = parseInt(commandValue);

        if (isNaN(value)) {
            Athena.player.emit.message(player, ChatController.getDescription('setfood'));
            return;
        }

        value = VitalsSystem.normalizeVital(value);
        VitalsSystem.adjustVital(player, VITAL_NAMES.FOOD, value, true);
    }
}

export class VitalsCommands {
    /**
     * Initialize Chat Commands
     *
     * @static
     * @memberof VitalsCommands
     */
    static init() {
        ChatController.addCommand('setfood', '/setfood [amount]', PERMISSIONS.ADMIN, InternalCommands.setFood);
        ChatController.addCommand('setwater', '/setwater [amount]', PERMISSIONS.ADMIN, InternalCommands.setWater);
    }
}
