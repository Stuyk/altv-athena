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
    const callBackName = `${player.name}-${player.id}-${Math.floor(Math.random())}`;
    alt.onceClient(callBackName, handleWaypoint);
    alt.emitClient(player, SYSTEM_EVENTS.GET_WAYPOINT, callBackName);
    alt.setTimeout(() => {
        alt.offClient(callBackName, handleWaypoint);
    }, 5000);
}

function handleWaypoint(player: alt.Player, pos: alt.IVector3) {
    if (!pos || !pos.z) {
        playerFuncs.emit.message(player, `Could not find ground Z position.`);
        return;
    }

    playerFuncs.safe.setPosition(player, pos.x, pos.y, pos.z);
}
