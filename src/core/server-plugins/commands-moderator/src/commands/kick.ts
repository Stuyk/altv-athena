import * as alt from 'alt-server';
import { playerFuncs } from '../../../../server/extensions/extPlayer';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';
export function handleKickCmd(player: alt.Player, id: number, ...reason: string[]) {
    reason.join(' ');
    const target = playerFuncs.get.findByUid(id);
    if (!target || !target.valid) {
        return;
    }

    if (target.accountData.permissionLevel >= PERMISSIONS.ADMIN) {
        playerFuncs.emit.notification(player, `This person can't be kicked.`);
        return;
    }

    target.kick(`You are kicked from the server by ${player.data.name} | Reason: ${reason}`);
}
