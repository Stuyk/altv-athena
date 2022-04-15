import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { Collections } from '../../../../../server/interface/iDatabaseCollections';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';
export async function handleBanCmd(player: alt.Player, id: number, reason: string) {
    const target = Athena.player.get.findByUid(id);
    if (!target || !target.valid || !id) {
        return;
    }

    if (target.accountData.permissionLevel >= PERMISSIONS.ADMIN) {
        Athena.player.emit.notification(player, `This person can't be kicked.`);
        return;
    }

    Athena.player.emit.notification(player, `${target.data.name} was banned from the Server.`);
    target.kick(`You were banned from the Server - ${reason}`);
    await Database.updatePartialData(target.accountData._id, { banned: true, reason: reason }, Collections.Accounts);
}
