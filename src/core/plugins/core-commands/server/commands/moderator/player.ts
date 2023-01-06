import alt from 'alt-server';
import { Athena } from '@AthenaServer/api/athena';
import { AdminController } from '@AthenaServer/systems/admin';
import { PERMISSIONS } from '@AthenaShared/flags/permissionFlags';
import { LOCALE_KEYS } from '@AthenaShared/locale/languages/keys';
import { LocaleController } from '@AthenaShared/locale/locale';

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
    (player: alt.Player, value: number = 100, id: string | null = null) => {
        if (isNaN(value)) {
            Athena.player.emit.message(player, '/sethealth [value] [id]');
            return;
        }

        if (value < 99) value = 99;
        if (value > 199) value = 199;

        if (id === null || id === undefined) {
            finishSetHealth(player, value);
            return;
        }

        const target = Athena.systems.identifier.getPlayer(id);
        if (!target) {
            Athena.player.emit.message(player, 'Cannot find player with that ID.');
            return;
        }

        finishSetHealth(target, value);
    },
);

Athena.systems.messenger.commands.register(
    'setarmour',
    '/setarmour [value] [id]',
    ['admin'],
    (player: alt.Player, value: number = 100, id: string | null = null) => {
        if (isNaN(value)) {
            Athena.player.emit.message(player, '/setarmour [value] [id]');
            return;
        }

        if (value < 0) value = 0;
        if (value > 100) value = 100;

        if (id === null || id === undefined) {
            finishSetArmour(player, value);
            return;
        }

        const target = Athena.systems.identifier.getPlayer(id);
        if (!target) {
            Athena.player.emit.message(player, 'Cannot find player with that ID.');
            return;
        }

        finishSetArmour(target, value);
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
        Athena.player.set.frozen(target, true);
        Athena.player.emit.notification(player, `Froze ${data.name} successfully!`);
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
        Athena.player.set.frozen(target, false);
        Athena.player.emit.notification(player, `Unfroze ${data.name} successfully!`);
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

        const accountData = Athena.document.account.get(target);
        if (accountData.permissionLevel >= PERMISSIONS.ADMIN) {
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

        const accountData = Athena.document.account.get(target);
        if (accountData.permissionLevel >= PERMISSIONS.ADMIN) {
            Athena.player.emit.notification(player, `This person can't be kicked.`);
            return;
        }

        const data = Athena.document.character.get(target);
        Athena.player.emit.notification(player, `${data.name} was banned from the Server.`);
        target.kick(`You were banned from the Server - ${reason}`);
        await Athena.database.funcs.updatePartialData(
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

        const unbanned = AdminController.unbanPlayer(discordIdentifier);
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
    'addperm',
    '/addperm [id] [perm]',
    ['admin'],
    async (player: alt.Player, id: string | null = null, perm: string) => {
        if (!player || !player.valid) return;

        const target = Athena.systems.identifier.getPlayer(id);
        if (!target) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_FIND_PLAYER));
            return;
        }

        const accountData = Athena.document.account.get(target);
        if (typeof accountData === 'undefined') {
            return;
        }

        const data = Athena.document.character.get(target);
        if (typeof data === 'undefined') {
            return;
        }

        accountData.permissionLevel = permissionLevel;
        await Athena.database.funcs.updatePartialData(
            accountData._id,
            { permissionLevel: accountData.permissionLevel },
            Athena.database.collections.Accounts,
        );

        alt.logWarning(`(${data.name}) had their permission level changed to: ${permissionLevel}.`);
    },
);

class PlayersCommand {
    @command('makeAdmin', '/makeAdmin <ID> - Add permission specified player.', PERMISSIONS.ADMIN)
    private static async makeAdminCommand(player: alt.Player, id: number | string, permissionLevel: number) {}

    @command('info', '/info <ID> - Get account info for the specified id.', PERMISSIONS.ADMIN)
    private static infoCommand(player: alt.Player, id: number) {
        const target = Athena.systems.identifier.getPlayer(id);

        if (!target || !target.valid) return;

        const accountData = Athena.document.account.get(target);
        if (!accountData) {
            Athena.player.emit.notification(player, `Could not find account info for ${id}!`);
            return;
        }

        const dataToSend = [];
        const data = Athena.document.character.get(target);
        if (typeof data === 'undefined') {
            return;
        }

        dataToSend.push(`--- INFO FOR ${data.name} ---`);
        dataToSend.push(`ACCOUNT: ${data.account_id.toString()}`);

        if (accountData.discord) {
            dataToSend.push(`DISCORD: ${accountData.discord}`);
        }

        dataToSend.push(`IPs: ${JSON.stringify(accountData.ips)}`);
        dataToSend.push(`PERMISSION LEVEL: ${accountData.permissionLevel}`);
        dataToSend.push(`HARDWARE: ${accountData.hardware}`);
        dataToSend.push(`--- --- ---`);

        for (const element of dataToSend) {
            Athena.player.emit.message(player, element);
        }
    }

    @command('tempcomponent', '/tempcomponent id num', PERMISSIONS.ADMIN)
    private static setComponent(player: alt.Player, id: string, value: string) {
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
    }

    @command('tempprop', '/tempprop id num', PERMISSIONS.ADMIN)
    private static setProp(player: alt.Player, id: string, value: string) {
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
    }
}
