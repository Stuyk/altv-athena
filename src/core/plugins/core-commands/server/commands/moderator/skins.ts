import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

Athena.systems.messenger.commands.register(
    'setskin',
    '/setskin [model] [?id]',
    ['admin'],
    async (player: alt.Player, model: string | undefined, id: string | undefined) => {
        if (typeof model === 'undefined') {
            Athena.player.emit.message(player, `Must specify an id`);
            return;
        }

        let target = player;
        if (typeof id !== 'undefined') {
            target = Athena.systems.identifier.getPlayer(id);
        }

        if (typeof target === 'undefined') {
            return;
        }

        await Athena.systems.inventory.clothing.setSkin(target, model);
    },
);

Athena.systems.messenger.commands.register(
    'clearskin',
    '/clearskin [?id]',
    ['admin'],
    async (player: alt.Player, id: string | undefined) => {
        let target = player;

        const hash = typeof target.model === 'number' ? target.model : alt.hash(target.model);

        if (typeof id !== 'undefined') {
            target = Athena.systems.identifier.getPlayer(id);
        }

        if (typeof target === 'undefined') {
            return;
        }

        Athena.systems.inventory.clothing.clearSkin(target);

        let pedInfo = Athena.utility.hashLookup.ped.hash(hash);

        Athena.player.emit.message(player, `Skin ${pedInfo.name} was removed.`);
    },
);
