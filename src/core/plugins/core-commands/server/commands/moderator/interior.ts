import alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

Athena.systems.messenger.commands.register(
    'setdimension',
    '/setdimension [id] [dimension]',
    ['admin'],
    (player: alt.Player, id: string, dimension: string) => {
        const target = Athena.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id) {
            return;
        }

        const data = Athena.document.character.get(player);
        Athena.player.safe.setDimension(target, parseInt(dimension));
        Athena.document.character.set(target, 'dimension', dimension);
        Athena.player.emit.notification(player, `Set dimension of ${data.name} to ${target.dimension}!`);
    },
);

Athena.systems.messenger.commands.register(
    'setinterior',
    '/setinterior [id] [interior]',
    ['admin'],
    (player: alt.Player, id: string, interior: string) => {
        const target = Athena.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id) {
            return;
        }

        const data = Athena.document.character.get(player);
        Athena.document.character.set(target, 'interior', interior);
        Athena.player.emit.notification(player, `Set dimension of ${data.name} to ${target.dimension}!`);
    },
);
