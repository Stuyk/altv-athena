import * as alt from 'alt-server';
import { Permissions } from '../../shared/flags/permissions';
import { CommandsLocale } from '../../shared/locale/commands';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';

ChatController.addCommand(
    'removebreaditem',
    '/removebreaditem - Removes a single bread item if present',
    Permissions.Admin,
    handleCommand
);

function handleCommand(player: alt.Player): void {
    const didRemove = playerFuncs.inventory.findAndRemove(player, 'Bread');

    if (!didRemove) {
        playerFuncs.emit.message(player, `Couldn't find the bread.`);
        return;
    }

    playerFuncs.emit.message(player, `Removed the bread.`);
}
