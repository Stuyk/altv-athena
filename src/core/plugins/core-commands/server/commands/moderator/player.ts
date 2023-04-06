import alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import Database from '@stuyk/ezmongodb';

function finishSetHealth(target: alt.Player, value: number) {
    Athena.player.safe.addHealth(target, value, true);
    Athena.player.emit.message(target, `Player health was set to ${value}`);
}

function finishSetArmour(target: alt.Player, value: number) {
    Athena.player.safe.addArmour(target, value, true);
    Athena.player.emit.message(target, `Player armour was set to ${value}`);
}

Athena.systems.messenger.commands.register(
    'sethealth',
    '/sethealth [value] [id]',
    ['admin'],
    (player: alt.Player, value: string = '100', id: string | null = null) => {
        if (isNaN(parseInt(value))) {
            Athena.player.emit.message(player, '/sethealth [value] [id]');
            return;
        }

        let actualValue = parseInt(value);
        if (actualValue < 99) {
            actualValue = 99;
        }

        if (actualValue > 199) {
            actualValue = 199;
        }

        if (id === null || id === undefined) {
            finishSetHealth(player, actualValue);
            return;
        }

        const target = Athena.systems.identifier.getPlayer(id);
        if (!target) {
            Athena.player.emit.message(player, 'Cannot find player with that ID.');
            return;
        }

        finishSetHealth(target, actualValue);
    },
);

Athena.systems.messenger.commands.register(
    'setarmour',
    '/setarmour [value] [id]',
    ['admin'],
    (player: alt.Player, value: string = '100', id: string | null = null) => {
        if (isNaN(parseInt(value))) {
            Athena.player.emit.message(player, '/setarmour [value] [id]');
            return;
        }
        let actualValue = parseInt(value);
        if (actualValue < 0) {
            actualValue = 0;
        }

        if (actualValue > 100) {
            actualValue = 100;
        }

        if (id === null || id === undefined) {
            finishSetArmour(player, actualValue);
            return;
        }

        const target = Athena.systems.identifier.getPlayer(id);
        if (!target) {
            Athena.player.emit.message(player, 'Cannot find player with that ID.');
            return;
        }

        finishSetArmour(target, actualValue);
    },
);

Athena.systems.messenger.commands.register(
    'freeze',
    '/freeze [id]',
    ['admin'],
    (player: alt.Player, id: string | null = null) => {
        const target = Athena.systems.identifier.getPlayer(id);

        if (!target || !target.valid) {
            return;
        }

        const data = Athena.document.character.get(target);
        Athena.player.safe.setPosition(target, target.pos.x, target.pos.y, target.pos.z);
        Athena.player.emit.notification(player, `Froze ${data.name} successfully!`);
        target.frozen = true;
    },
);

Athena.systems.messenger.commands.register(
    'unfreeze',
    '/unfreeze [id]',
    ['admin'],
    (player: alt.Player, id: string | null = null) => {
        const target = Athena.systems.identifier.getPlayer(id);

        if (!target || !target.valid) {
            return;
        }

        const data = Athena.document.character.get(target);
        Athena.player.emit.notification(player, `Unfroze ${data.name} successfully!`);
        target.frozen = false;
    },
);

Athena.systems.messenger.commands.register(
    'kick',
    '/kick [id] [...reason]',
    ['admin'],
    (player: alt.Player, id: string | null = null, reason: string) => {
        const target = Athena.systems.identifier.getPlayer(id);

        if (!target || !target.valid) {
            return;
        }

        if (Athena.systems.permission.has('account', target, 'admin')) {
            Athena.player.emit.notification(player, `This person can't be kicked.`);
            return;
        }

        const data = Athena.document.character.get(player);
        target.kick(`You are kicked from the server by ${data.name} | Reason: ${reason}`);
    },
);

Athena.systems.messenger.commands.register(
    'ban',
    '/ban [id] [...reason]',
    ['admin'],
    async (player: alt.Player, id: string | null = null, reason: string) => {
        const target = Athena.systems.identifier.getPlayer(id);

        if (!target || !target.valid || !id) {
            return;
        }

        if (Athena.systems.permission.has('account', target, 'admin')) {
            Athena.player.emit.notification(player, `This person can't be kicked.`);
            return;
        }

        const accountData = Athena.document.account.get(target);
        const data = Athena.document.character.get(target);
        Athena.player.emit.notification(player, `${data.name} was banned from the Server.`);
        target.kick(`You were banned from the Server - ${reason}`);
        await Database.updatePartialData(
            accountData._id,
            { banned: true, reason: reason },
            Athena.database.collections.Accounts,
        );
    },
);

Athena.systems.messenger.commands.register(
    'unban',
    '/unban [discord_identifier]',
    ['admin'],
    async (player: alt.Player, discordIdentifier: string | null = null) => {
        if (!player || !player.valid) {
            return;
        }

        const unbanned = Athena.controllers.admin.unbanPlayerByDiscord(discordIdentifier);
        if (unbanned) {
            const data = Athena.document.character.get(player);
            Athena.player.emit.message(player, `Unbanned ${discordIdentifier} (Discord)`);
            alt.logWarning(`${discordIdentifier} (Discord) was unbanned by ${data.name}`);
            return;
        }

        Athena.player.emit.message(player, `Could not find that account with Discord ID: ${discordIdentifier}`);
    },
);

Athena.systems.messenger.commands.register(
    'tempcomponent',
    '/tempcomponent [id] [value]',
    ['admin'],
    async (player: alt.Player, id: string, value: string) => {
        if (typeof id === 'undefined' || typeof value === 'undefined') {
            Athena.player.emit.message(player, `Must provide id, and value.`);
            return;
        }

        try {
            player.setClothes(parseInt(id), parseInt(value), 0, 0);
            Athena.player.emit.message(player, `Successfully set temp component - ${id} ${value}`);
        } catch (err) {
            Athena.player.emit.message(player, err.toString());
        }
    },
);

Athena.systems.messenger.commands.register(
    'tempprop',
    '/tempprop [id] [value]',
    ['admin'],
    async (player: alt.Player, id: string, value: string) => {
        if (typeof id === 'undefined' || typeof value === 'undefined') {
            Athena.player.emit.message(player, `Must provide id, and value.`);
            return;
        }

        try {
            player.setProp(parseInt(id), parseInt(value), 0);
            Athena.player.emit.message(player, `Successfully set temp prop - ${id} ${value}`);
        } catch (err) {
            Athena.player.emit.message(player, err.toString());
        }
    },
);

Athena.systems.messenger.commands.register('hasitemcheck', '/hasitemcheck', ['admin'], async (player: alt.Player) => {
    const result = await Athena.player.inventory.has(player, 'burger', 1);
    console.log(result);
});
