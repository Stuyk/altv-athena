import * as alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { PlayerEvents } from '../../../../../server/events/playerEvents';
import { ATHENA_EVENTS_PLAYER } from '../../../../../shared/enums/athenaEvents';

export function handleDimensionCmd(player: alt.Player, id: number, dimension: number) {
    const target = Athena.player.get.findByUid(id);
    if (!target || !target.valid || !id) {
        return;
    }

    Athena.player.safe.setDimension(target, dimension);
    Athena.player.save.field(target, 'dimension', dimension);
    Athena.player.emit.notification(player, `Set dimension of ${target.data.name} to ${target.dimension}!`);
}

PlayerEvents.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, (player: alt.Player) => {
    Athena.player.safe.setDimension(player, player.data.dimension);
});
