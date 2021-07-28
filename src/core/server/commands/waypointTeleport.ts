import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Permissions } from '../../shared/flags/permissions';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';

ChatController.addCommand(
    'tpwp',
    LocaleController.get(LOCALE_KEYS.COMMAND_TELEPORT_WAYPOINT, '/tpwp'),
    Permissions.Admin,
    handleCommand
);

function handleCommand(player: alt.Player): void {
    if (!player.currentWaypoint) {
        playerFuncs.emit.message(player, `Set a waypoint first.`);
        return;
    }

    playerFuncs.safe.setPosition(player, player.currentWaypoint.x, player.currentWaypoint.y, player.currentWaypoint.z);
}
