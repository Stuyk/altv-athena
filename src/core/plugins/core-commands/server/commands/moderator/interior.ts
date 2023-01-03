import alt from 'alt-server';
import { Athena } from '@AthenaServer/api/athena';
import { command } from '@AthenaServer/decorators/commands';
import { PlayerEvents } from '@AthenaServer/events/playerEvents';
import { ATHENA_EVENTS_PLAYER } from '@AthenaShared/enums/athenaEvents';
import { PERMISSIONS } from '@AthenaShared/flags/permissionFlags';

class InteriorCommands {
    @command('setdimension', '/setdimension <ID> <DIMENSION>', PERMISSIONS.ADMIN)
    private static setDimensionCommand(player: alt.Player, id: number, dimension: number) {
        const target = Athena.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id) return;

        Athena.player.safe.setDimension(target, dimension);
        Athena.document.character.set(target, 'dimension', dimension);
        Athena.player.emit.notification(player, `Set dimension of ${target.data.name} to ${target.dimension}!`);
    }

    @command('setinterior', '/setinterior <ID> <INTERIOR>', PERMISSIONS.ADMIN)
    private static setInteriorCommand(player: alt.Player, id: number, interior: string) {
        const target = Athena.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id) return;

        Athena.document.character.set(target, 'interior', interior);
        Athena.player.emit.notification(player, `New Interior of ${target.data.name} is: ${interior}!`);
    }
}

PlayerEvents.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, (player: alt.Player) => {
    Athena.player.safe.setDimension(player, player.data.dimension);
});
