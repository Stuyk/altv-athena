import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { AdminController } from '../../../../../server/systems/admin';

export async function handleUnbanCmd(player: alt.Player, discordIdentifier: string) {
    if (!player || !player.valid) {
        return;
    }
    const unbanned = AdminController.unbanPlayer(discordIdentifier);
    if (unbanned) {
        Athena.player.emit.message(player, `Unbanned ${discordIdentifier} (Discord)`);
        alt.logWarning(`${discordIdentifier} (Discord) was unbanned by ${player.data.name}`);
        return;
    }
    Athena.player.emit.message(player, `Could not find that account with Discord ID: ${discordIdentifier}`);
}
