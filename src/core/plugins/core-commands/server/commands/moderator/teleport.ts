import alt from 'alt-server';
import * as Athena from '@AthenaServer/api';

Athena.systems.messenger.commands.register(
    'gethere',
    '/gethere [id]',
    ['admin'],
    async (player: alt.Player, id: string | undefined) => {
        const target = Athena.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id || target === player) {
            return;
        }

        const data = Athena.document.character.get(target);

        Athena.player.safe.setPosition(target, player.pos.x + 1, player.pos.y, player.pos.z);
        Athena.player.emit.notification(player, `Successfully teleported ${data.name} to your position!`);
    },
);

Athena.systems.messenger.commands.register(
    'goto',
    '/goto [id]',
    ['admin'],
    async (player: alt.Player, id: string | undefined) => {
        const target = Athena.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id || target === player) {
            return;
        }

        Athena.player.safe.setPosition(player, target.pos.x + 1, target.pos.y, target.pos.z);
    },
);

Athena.systems.messenger.commands.register(
    'tpwp',
    '/tpwp [id]',
    ['admin'],
    async (player: alt.Player, id: string | undefined) => {
        if (!player.currentWaypoint) {
            Athena.player.emit.message(player, `Set a waypoint first.`);
            return;
        }

        Athena.player.safe.setPosition(
            player,
            player.currentWaypoint.x,
            player.currentWaypoint.y,
            player.currentWaypoint.z,
        );
    },
);

Athena.systems.messenger.commands.register(
    'coords',
    '/coords [x] [y] [z]',
    ['admin'],
    async (player: alt.Player, x: string, y: string, z: string) => {
        try {
            Athena.player.safe.setPosition(player, parseFloat(x), parseFloat(y), parseFloat(z));
        } catch (err) {
            const cmd = Athena.systems.messenger.commands.get('coords');
            Athena.player.emit.message(player, cmd.description);
        }
    },
);

Athena.systems.messenger.commands.register(
    'getcar',
    '/getcar [id]',
    ['admin'],
    async (player: alt.Player, id: string) => {
        const tmpID = parseInt(id);
        if (isNaN(tmpID)) {
            return;
        }

        // Find the vehicle
        const validVehicle = alt.Vehicle.all.find((veh) => {
            if (!veh || !veh.valid) {
                return false;
            }

            return veh.id === tmpID;
        });

        // no spawned vehicle was found
        if (!validVehicle || !validVehicle.valid) {
            return;
        }

        // Move the vehicle to the player.
        validVehicle.pos = player.pos;
    },
);

Athena.systems.messenger.commands.register(
    'tpto',
    '/tpto [partial_name]',
    ['admin'],
    async (player: alt.Player, partial_name: string) => {
        if (!partial_name) {
            Athena.player.emit.message(player, `tpto <partial_name>`);
            return;
        }

        if (partial_name.includes('_')) {
            partial_name = partial_name.replace('_', '');
        }

        const target = Athena.getters.player.byPartialName(partial_name);
        if (!target || !target.valid) {
            Athena.player.emit.message(player, `Could not find that player.`);
            return;
        }

        if (player.vehicle) {
            player.vehicle.pos = target.pos;
            return;
        }

        Athena.player.safe.setPosition(player, target.pos.x, target.pos.y, target.pos.z);
    },
);

Athena.systems.messenger.commands.register(
    'tphere',
    '/tphere [partial_name]',
    ['admin'],
    async (player: alt.Player, partial_name: string) => {
        if (!partial_name) {
            Athena.player.emit.message(player, `tpto <partial_name>`);
            return;
        }

        if (partial_name.includes('_')) {
            partial_name = partial_name.replace('_', '');
        }

        const target = Athena.getters.player.byPartialName(partial_name);
        if (!target || !target.valid) {
            Athena.player.emit.message(player, `Could not find that player.`);
            return;
        }

        if (target.vehicle) {
            target.vehicle.pos = player.pos;
            return;
        }

        Athena.player.safe.setPosition(target, player.pos.x, player.pos.y, player.pos.z);
    },
);

Athena.systems.messenger.commands.register('tpall', '/tpall', ['admin'], async (player: alt.Player) => {
    const onlinePlayers = Athena.getters.players.online();
    for (let target of onlinePlayers) {
        if (!target || !target.valid) {
            return;
        }

        Athena.player.safe.setPosition(target, player.pos.x, player.pos.y, player.pos.z);
    }
});
