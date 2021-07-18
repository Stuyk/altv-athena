import Database from '@stuyk/ezmongodb';
import * as alt from 'alt-server';
import fs from 'fs';

import { Account } from '../interface/Account';
import { Collections } from '../interface/DatabaseCollections';
import { AdminController } from '../systems/admin';
import ChatController from '../systems/chat';
import { OptionsController } from '../systems/options';
import Logger from './athenaLogger';

alt.onClient('/screenshot', handleSaveScreenshot);
alt.on('consoleCommand', handleConsoleMessage);

const command = {
    '/setadmin': handleSetAdmin,
    '/kickall': handleKickAll,
    '/kick': handleKick,
    '/screenshot': handleScreenshot,
    '/ban': handleBan,
    '/unban': handleUnban,
    '/dox': handleDox,
    '/addwhitelist': handleAddWhitelist,
    '/removewhitelist': handleRemoveWhitelist,
    '/commands': ChatController.printAllCommands
};

/**
 * Handles console commands when server is free.
 * @param {...string[]} args
 */
function handleConsoleMessage(...args: string[]) {
    alt.setTimeout(() => {
        const cmdName = args[0].toLowerCase();

        if (!command[cmdName]) {
            Logger.warning(`${cmdName} is not a valid command.`);
            return;
        }

        command[cmdName](...args);
    }, 0);
}

function handleKickAll(cmdName: string, ...args: any[]) {
    const reason = args.join(' ');
    alt.Player.all.forEach((player) => {
        Logger.info(`Kicked: (${player.id}) ${player.data.name ? player.data.name : 'Not Logged In'}`);
        player.kick(`Kick All: ${reason}`);
    });
}

async function handleBan(cmdName: string, discord_or_id: string, ...args: any[]) {
    if (!discord_or_id) {
        Logger.error(`/unban <discord_or_id> <reason>`);
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
        Logger.error(`Could not find that id or discord id.`);
        return;
    }

    await Database.updatePartialData(account._id.toString(), { banned: true, reason }, Collections.Accounts);
    Logger.info(`Successfully banned ${discord_or_id}`);
    player.kick(reason);
}

function handleUnban(cmdName: string, discord: string) {
    if (!discord) {
        Logger.error(`/unban <discord_id>`);
        return;
    }

    AdminController.unbanPlayer(discord);
}

function handleSetAdmin(cmdName: string, discord: string, permissionLevel: string | number) {
    if (discord === undefined || permissionLevel === undefined) {
        Logger.error(`/setadmin <discord_id> <permission_level>`);
        return;
    }

    const permission: number = parseInt(permissionLevel.toString());
    if (isNaN(permission)) {
        Logger.error(`Permission level is not a number.`);
        return;
    }

    const player = alt.Player.all.find((p) => p && p.accountData && p.accountData.discord === discord);
    if (!player) {
        Logger.error(`That player is not currently logged in.`);
        return;
    }

    player.accountData.permissionLevel = permission;
    saveField(player, 'permissionLevel', player.accountData.permissionLevel);
    ChatController.populateCommands(player);
    Logger.info(`(${discord}) ${player.data.name} had their permission level changed to: ${permissionLevel}.`);
}

function handleKick(cmdName: string, discordNameIDCatchAll: string, ...args: any[]) {
    if (!discordNameIDCatchAll) {
        Logger.error(`/kick <discord_or_id_or_name`);
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
        Logger.error(`Could not find ${discordNameIDCatchAll}.`);
        return;
    }

    player.kick(reason);
    Logger.info(`${discordNameIDCatchAll} has been kicked from the server.`);
}

async function handleScreenshot(cmdName: string, id: string) {
    if (!id) {
        Logger.error(`/screenshot <ingame_id>`);
        return;
    }

    const player = alt.Player.all.find((p) => p && p.data && p.valid && `${p.id}` === `${id}`);
    if (!player) {
        Logger.error(`Could not find ${id}`);
        return;
    }

    Logger.info(`Attempting screenshot of... ${player.id}`);
    alt.emitClient(player, cmdName);
}

function handleDox(cmdName: string, id: string) {
    if (id === undefined) {
        Logger.error(`/dox <discord_id>>`);
        return;
    }

    const player = alt.Player.all.find((p) => p && p.accountData && `${p.id}` === `${id}`);
    if (!player) {
        Logger.error(`That player is not currently logged in.`);
        return;
    }

    console.log(`=== Player Account (${id}) ===`);
    console.log(`Player Name: ${player.data.name}`);
    Object.keys(player.accountData).forEach((key) => {
        console.log(`${key}: ${JSON.stringify(player.accountData[key])}`);
    });
}

async function handleAddWhitelist(cmdName: string, id: string) {
    if (id === undefined) {
        Logger.error(`/addwhitelist <discord_id>>`);
        return;
    }

    const wasAdded = OptionsController.addToWhitelist(id);
    if (!wasAdded) {
        Logger.error(`Could not add: ${id} to the whitelist.`);
        return;
    }

    Logger.log(`${id} was added to the list.`);
}

async function handleRemoveWhitelist(cmdName: string, id: string) {
    if (id === undefined) {
        Logger.error(`/removewhitelist <discord_id>>`);
        return;
    }

    const wasRemoved = OptionsController.removeFromWhitelist(id);
    if (!wasRemoved) {
        Logger.log(`${id} does not exist in the list or was already removed.`);
        return;
    }

    Logger.log(`${id} was removed from the list.`);
}

async function handleSaveScreenshot(player: alt.Player, base64Image: string) {
    const path = `${process.cwd()}/screenshots/${player.data.name}.jpg`;
    Logger.info(path);
    const data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buf = Buffer.from(data, 'base64');
    fs.writeFileSync(path, buf);
}

async function saveField(p: alt.Player, fieldName: string, fieldValue: any): Promise<void> {
    if (process.env.TEST) {
        return;
    }

    await Database.updatePartialData(p.accountData._id, { [fieldName]: fieldValue }, Collections.Accounts);
}
