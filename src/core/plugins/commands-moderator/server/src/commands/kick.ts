import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';

import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
export function handleKickCmd(player: alt.Player, id: number, ...reason: string[]) {
    reason.join(' ');
    const target = Athena.player.get.findByUid(id);
    if (!target || !target.valid) {
        return;
    }

    if (target.accountData.permissionLevel >= PERMISSIONS.ADMIN) {
        Athena.player.emit.notification(player, `This person can't be kicked.`);
        return;
    }

    target.kick(`You are kicked from the server by ${player.data.name} | Reason: ${reason}`);
}
