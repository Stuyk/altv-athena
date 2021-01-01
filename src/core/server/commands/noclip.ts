import * as alt from 'alt-server';
import { addCommand } from '../systems/chat';
import { System_Events_NoClip } from '../../shared/enums/system';

alt.onClient(System_Events_NoClip.Reset, handleReset);
alt.onClient(System_Events_NoClip.Update, handleCamUpdate);

addCommand('noclip', handleCommand);

function handleCommand(player: alt.Player): void {
    const isNoClipping: boolean | null = player.getSyncedMeta('NoClipping');

    if (!isNoClipping) {
        player.setSyncedMeta('NoClipping', true);
        player.send(`No Clip: ON`);
        player.visible = false;
        return;
    }

    player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);
    player.setSyncedMeta('NoClipping', false);
    player.send(`No Clip: OFF`);
    player.visible = true;
}

function handleReset(player: alt.Player) {
    player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);
}

function handleCamUpdate(player, pos) {
    player.pos = pos;
}
