import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';

export function handleInfoCmd(player: alt.Player, id: number) {
    const target = Athena.player.get.findByUid(id);
    if (!target || !target.valid) {
        return;
    }

    if (!target.accountData) {
        Athena.player.emit.notification(player, `Could not find account info for ${id}!`);
    }

    const dataToSend = [];

    dataToSend.push(`--- INFO FOR ${target.data.name} ---`);
    dataToSend.push(`ACCOUNT: ${target.data.account_id.toString()}`);
    dataToSend.push(`DISCORD: ${target.accountData.discord}`);
    dataToSend.push(`IPs: ${JSON.stringify(target.accountData.ips)}`);
    dataToSend.push(`PERMISSION LEVEL: ${target.accountData.permissionLevel}`);
    dataToSend.push(`HARDWARE: ${target.accountData.hardware}`);
    dataToSend.push(`--- --- ---`);

    for (let i = 0; i < dataToSend.length; i++) {
        Athena.player.emit.message(player, dataToSend[i]);
    }
}
