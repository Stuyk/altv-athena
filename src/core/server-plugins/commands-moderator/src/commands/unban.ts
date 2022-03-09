import * as alt from 'alt-server';
import { playerFuncs } from '../../../../server/extensions/extPlayer';
import { AdminController } from '../../../../server/systems/admin';

export async function handleUnbanCmd(player: alt.Player, discordIdentifier: string) {
    if (!player || !player.valid) {
        return;
    }
    const unbanned = AdminController.unbanPlayer(discordIdentifier);
    if (unbanned) {
        playerFuncs.emit.message(player, `Unbanned ${discordIdentifier} (Discord)`);
        alt.logWarning(`${discordIdentifier} (Discord) was unbanned by ${player.data.name}`);
        return;
    }
    playerFuncs.emit.message(player, `Could not find that account with Discord ID: ${discordIdentifier}`);
}
