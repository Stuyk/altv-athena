import alt from 'alt-server';
import { Athena } from '../../../../../server/api/athena';
import { command } from '../../../../../server/decorators/commands';
import { PlayerEvents } from '../../../../../server/events/playerEvents';
import { ATHENA_EVENTS_PLAYER } from '../../../../../shared/enums/athenaEvents';
import { PERMISSIONS } from '../../../../../shared/flags/permissionFlags';

class InteriorCommands {
    @command('setdimension', '/setdimension <ID> <DIMENSION>', PERMISSIONS.ADMIN)
    private static setDimensionCommand(player: alt.Player, id: number, dimension: number) {
        const target = Athena.player.get.findByUid(id);

        if (!target || !target.valid || !id) return;

        Athena.player.safe.setDimension(target, dimension);
        Athena.player.save.field(target, 'dimension', dimension);
        Athena.player.emit.notification(player, `Set dimension of ${target.data.name} to ${target.dimension}!`);
    }

    @command('setinterior', '/setinterior <ID> <INTERIOR>', PERMISSIONS.ADMIN)
    private static setInteriorCommand(player: alt.Player, id: number, interior: string) {
        const target = Athena.player.get.findByUid(id);

        if (!target || !target.valid || !id) return;

        target.data.interior = interior;
        Athena.player.save.field(target, 'interior', target.data.interior);
        Athena.player.emit.notification(player, `New Interior of ${target.data.name} is: ${interior}!`);
    }
}

PlayerEvents.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, (player: alt.Player) => {
    Athena.player.safe.setDimension(player, player.data.dimension);
});
