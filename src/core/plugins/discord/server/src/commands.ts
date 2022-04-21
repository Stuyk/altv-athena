import * as alt from 'alt-server';
import { Athena } from '../../../../server/api/athena';
import ChatController from '../../../../server/systems/chat';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../shared/locale/locale';
import { ConsoleCommander } from '../../../core-console-cmds/shared/consoleCommander';
import { DiscordController } from './discordController';

export class DiscordCommands {
    static init() {
        alt.log('~lb~Discord Allow List Commands Loaded');
        Athena.controllers.chat.addCommand(
            'addallowlist',
            '/addallowlist <discord_id>',
            PERMISSIONS.ADMIN | PERMISSIONS.MODERATOR,
            DiscordCommands.addAllowListCommand,
        );

        Athena.controllers.chat.addCommand(
            'removeallowlist',
            '/removeallowlist <discord_id>',
            PERMISSIONS.ADMIN | PERMISSIONS.MODERATOR,
            DiscordCommands.removeAllowlistCommand,
        );

        ConsoleCommander.registerConsoleCommand('/addallowlist', DiscordCommands.addAllowListConsoleCommand);
        ConsoleCommander.registerConsoleCommand('/removeallowlist', DiscordCommands.removeAllowListConsoleCommand);
    }

    private static async addAllowListCommand(player: alt.Player, discord: string) {
        if (!discord) {
            Athena.player.emit.message(player, ChatController.getDescription('addallowlist'));
            return;
        }

        if (discord.length <= 17) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.DISCORD_ID_NOT_LONG_ENOUGH));
            return;
        }

        const member = await DiscordController.addToAllowList(discord);
        if (!member) {
            Athena.player.emit.message(player, `{FF0000}Could not find that user in discord.`);
            return;
        }

        Athena.player.emit.message(
            player,
            `{00FF00} Added to the allow list. ${member.user.username}#${member.user.discriminator}`,
        );
    }

    private static async removeAllowlistCommand(player: alt.Player, discord: string) {
        if (!discord) {
            Athena.player.emit.message(player, ChatController.getDescription('removeallowlist'));
            return;
        }

        if (discord.length <= 17) {
            Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.DISCORD_ID_NOT_LONG_ENOUGH));
            return;
        }

        const member = await DiscordController.removeFromAllowList(discord);
        if (!member) {
            Athena.player.emit.message(player, `{FF0000}Could not find that user in discord.`);
            return;
        }

        Athena.player.emit.message(
            player,
            `{FFFF00} Removed from the allow list. ${member.user.username}#${member.user.discriminator}`,
        );
    }

    private static async addAllowListConsoleCommand(discord: string) {
        if (discord === undefined) {
            alt.logWarning(`/addallowlist <discord_id>>`);
            return;
        }

        const member = await DiscordController.addToAllowList(discord);
        if (!member) {
            alt.log(`~lr~[Discord] Could not find that user in discord.`);
            return;
        }

        alt.log(`~c~[Discord] Added to the allow list. ${member.user.username}#${member.user.discriminator}`);
    }

    private static async removeAllowListConsoleCommand(discord: string) {
        if (discord === undefined) {
            alt.logWarning(`/removeallowlist <discord_id>>`);
            return;
        }

        const member = await DiscordController.removeFromAllowList(discord);
        if (!member) {
            alt.log(`~lr~[Discord] Could not find that user in discord.`);
            return;
        }

        alt.log(`~c~[Discord] Removed from the allow list. ${member.user.username}#${member.user.discriminator}`);
    }
}
