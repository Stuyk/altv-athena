import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import fs from 'fs';
import { Account } from '../../../../server/interface/iAccount';
import { Collections } from '../../../../server/interface/iDatabaseCollections';
import { AdminController } from '../../../../server/systems/admin';
import ChatController from '../../../../server/systems/chat';
import { AthenaScreenshot } from '../../../../server/utility/screenshot';
import { ConsoleCommander } from '../../../../shared/utility/consoleCommander';

async function handleSaveScreenshot(player: alt.Player, base64Image: string) {
    const path = `${process.cwd()}/screenshots/${player.data.name}.jpg`;
    const data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buf = Buffer.from(data, 'base64');
    fs.writeFileSync(path, buf);
    alt.log(path);
}

export class ConsoleCommands {
    static init() {
        ConsoleCommander.registerConsoleCommand('/commands', ConsoleCommands.commands);
        ConsoleCommander.registerConsoleCommand('/setadmin', ConsoleCommands.setAdmin);
        ConsoleCommander.registerConsoleCommand('/kickall', ConsoleCommands.kickAll);
        ConsoleCommander.registerConsoleCommand('/kick', ConsoleCommands.kick);
        ConsoleCommander.registerConsoleCommand('/ban', ConsoleCommands.ban);
        ConsoleCommander.registerConsoleCommand('/screenshot', ConsoleCommands.screenshot);
        ConsoleCommander.registerConsoleCommand('/dox', ConsoleCommands.dox);
    }

    static commands() {
        const commands = ConsoleCommander.getCommands();
        alt.log(`=== Console Commands ===`);
        for (let i = 0; i < commands.length; i++) {
            alt.log(commands[i]);
        }
    }

    static async setAdmin(discord: string, permissionLevel: string | number) {
        if (discord === undefined || permissionLevel === undefined) {
            alt.logWarning(`/setadmin <discord_id> <permission_level>`);
            return;
        }

        const permission: number = parseInt(permissionLevel.toString());
        if (isNaN(permission)) {
            alt.logWarning(`Permission level is not a number.`);
            return;
        }

        const player = alt.Player.all.find((p) => p && p.accountData && p.accountData.discord === discord);
        if (!player) {
            alt.logWarning(`That player is not currently logged in.`);
            return;
        }

        player.accountData.permissionLevel = permission;
        await Database.updatePartialData(
            player.accountData._id,
            { ['permissionLevel']: player.accountData.permissionLevel },
            Collections.Accounts,
        );

        ChatController.populateCommands(player);
        alt.log(`(${discord}) ${player.data.name} had their permission level changed to: ${permissionLevel}.`);
    }

    static kickAll(...args: string[]) {
        const reason = args.join(' ');
        alt.Player.all.forEach((player) => {
            alt.log(`Kicked: (${player.id}) ${player.data.name ? player.data.name : 'Not Logged In'}`);
            player.kick(`Kick All: ${reason}`);
        });
    }

    static kick(discordNameIDCatchAll: string, ...args: any[]) {
        if (!discordNameIDCatchAll) {
            alt.logWarning(`/kick <discord_or_id_or_name`);
            return;
        }

        const players = [...alt.Player.all];
        let player: alt.Player;

        for (let i = 0; i < players.length; i++) {
            const target = players[i];

            if (target.name === discordNameIDCatchAll) {
                player = target;
                break;
            }

            if (target.data && target.data.name === discordNameIDCatchAll) {
                player = target;
                break;
            }

            if (target.discord && target.discord.id === discordNameIDCatchAll) {
                player = target;
                break;
            }
        }

        const reason = args.join(' ');
        if (!player) {
            alt.logWarning(`Could not find ${discordNameIDCatchAll}.`);
            return;
        }

        player.kick(reason);
        alt.log(`${discordNameIDCatchAll} has been kicked from the server.`);
    }

    static async ban(discord_or_id: string, ...args: any[]) {
        if (!discord_or_id) {
            alt.logWarning(`/ban <discord_or_id> <reason>`);
            return;
        }

        const reason = args.join(' ');
        const player = alt.Player.all.find((p) => {
            if (p.accountData && (p.accountData.discord === discord_or_id || `${p.id}` === `${discord_or_id}`)) {
                return true;
            }

            return false;
        });

        const account = await Database.fetchData<Account>('discord', discord_or_id, Collections.Accounts);
        if (!account) {
            alt.logWarning(`Could not find that id or discord id.`);
            return;
        }

        await Database.updatePartialData(account._id.toString(), { banned: true, reason }, Collections.Accounts);
        alt.log(`Successfully banned ${discord_or_id}`);
        player.kick(reason);
    }

    static async unban(discord: string) {
        if (!discord) {
            alt.logWarning(`/unban <discord_id>`);
            return;
        }

        AdminController.unbanPlayer(discord);
    }

    static async screenshot(id: string) {
        if (!id) {
            alt.logWarning(`/screenshot <ingame_id>`);
            return;
        }

        const player = alt.Player.all.find((p) => p && p.data && p.valid && `${p.id}` === `${id}`);
        if (!player) {
            alt.logWarning(`Could not find ${id}`);
            return;
        }

        if (player.data.name) {
            alt.log(`Creating screenshot of... (${player.id}) ${player.data.name}`);
        } else {
            alt.log(`Creating screenshot of... ID: ${player.id}`);
        }

        const screenshot = await AthenaScreenshot.takeScreenshot(player);
        if (!screenshot) {
            alt.logWarning(`Failed to create screenshot of ${player.id}`);
            return;
        }

        handleSaveScreenshot(player, screenshot);
    }

    static dox(id: string) {
        if (id === undefined) {
            alt.logWarning(`/dox <discord_id>`);
            return;
        }

        const player = alt.Player.all.find((p) => p && p.accountData && `${p.id}` === `${id}`);
        if (!player) {
            alt.logWarning(`That player is not currently logged in.`);
            return;
        }

        alt.log(`=== Player Account (${id}) ===`);
        alt.log(`Player Name: ${player.data.name}`);
        Object.keys(player.accountData).forEach((key) => {
            alt.log(`${key}: ${JSON.stringify(player.accountData[key])}`);
        });
    }
}
