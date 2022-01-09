import * as alt from 'alt-server';
import { PERMISSIONS } from '../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/extPlayer';
import ChatController from '../systems/chat';

ChatController.addCommand(
    'tpwp',
    LocaleController.get(LOCALE_KEYS.COMMAND_TELEPORT_WAYPOINT, '/tpwp'),
    PERMISSIONS.ADMIN,
    handleCommand,
);

function handleCommand(player: alt.Player): void {
    if (!player.currentWaypoint) {
        playerFuncs.emit.message(player, `Set a waypoint first.`);
        return;
    }

    playerFuncs.safe.setPosition(player, player.currentWaypoint.x, player.currentWaypoint.y, player.currentWaypoint.z);
}
