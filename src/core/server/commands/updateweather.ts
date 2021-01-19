import * as alt from 'alt-server';
import { Permissions } from '../../shared/flags/permissions';
import ChatController from '../systems/chat';

ChatController.addCommand(
    'updateweather',
    '/updateweather - Forcefully updates your weather based on region.',
    Permissions.Admin,
    handleCommand
);

function handleCommand(player: alt.Player): void {
    player.sync().weather();
}
