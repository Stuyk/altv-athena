import * as alt from 'alt-server';
import { playerFuncs } from '../../../../server/extensions/extPlayer';
export function handleInfoCmd(player: alt.Player, id: number) {
    const target = playerFuncs.get.findByUid(id);
    if (!target || !target.valid) {
        return;
    }

    if (!target.accountData) {
        playerFuncs.emit.notification(player, `Could not find account info for ${id}!`);
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
        playerFuncs.emit.message(player, dataToSend[i]);
    }
}
