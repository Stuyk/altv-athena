import * as alt from 'alt-server';
import { Permissions } from '../../shared/flags/permissions';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';

ChatController.addCommand('setfood', '/setfood [amount] - Set the food level', Permissions.Admin, handleCommand);

function handleCommand(player: alt.Player, value: string): void {
    let foodLevel = parseInt(value);

    if (isNaN(foodLevel)) {
        playerFuncs.emit.message(player, ChatController.getDescription('setfood'));
        return;
    }

    if (foodLevel > 100) {
        foodLevel = 100;
    }

    if (foodLevel < 0) {
        foodLevel = 0;
    }

    player.data.food = foodLevel;
    playerFuncs.save.field(player, 'food', player.data.food);
    playerFuncs.sync.food(player);
    playerFuncs.emit.message(player, `Set Food to: ${foodLevel}`);
}
