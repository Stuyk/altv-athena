import * as alt from 'alt-server';
import { Athena } from '@AthenaServer/api/athena';

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

        await Athena.systems.itemClothing.skin.set(player, model);
    },
);

Athena.systems.messenger.commands.register(
    'clearskin',
    '/clearskin [?id]',
    ['admin'],
    async (player: alt.Player, id: string | undefined) => {
        let target = player;
        if (typeof id !== 'undefined') {
            target = Athena.systems.identifier.getPlayer(id);
        }

        if (typeof target === 'undefined') {
            return;
        }

        Athena.systems.itemClothing.skin.clear(target);
    },
);
