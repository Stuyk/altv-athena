import * as alt from 'alt-server';
import { PlayerEvents } from '../../../../server/events/playerEvents';
import { playerFuncs } from '../../../../server/extensions/extPlayer';
import { ATHENA_EVENTS_PLAYER } from '../../../../shared/enums/athenaEvents';
import * as charRef from '../../../../shared/interfaces/character';
// Extends the player interface.
declare module 'alt-server' {
    export interface Character extends Partial<charRef.Character> {
        dimension?: number;
    }
}

export function handleDimensionCmd(player: alt.Player, id: number, dimension: number) {
    const target = playerFuncs.get.findByUid(id);
    if (!target || !target.valid || !id) {
        return;
    }

    playerFuncs.safe.setDimension(target, dimension);
    playerFuncs.save.field(target, 'dimension', dimension);
    playerFuncs.emit.notification(player, `Set dimension of ${target.data.name} to ${target.dimension}!`);
}

PlayerEvents.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, (player: alt.Player) => {
    playerFuncs.safe.setDimension(player, player.data.dimension);
});
