import Discord from 'discord.js';

import { DEFAULT_CONFIG } from '../athena/main';
import Logger from '../utility/athenaLogger';
import { OptionsController } from './options';

export class DiscordController {
    static client: Discord.Client = new Discord.Client({
        ws: { intents: new Discord.Intents(Discord.Intents.ALL) }
    });

    static whitelistRole = process.env.WHITELIST_ROLE ? process.env.WHITELIST_ROLE : null;
    static guild: Discord.Guild;

    static populateEndpoints() {
        DiscordController.client.on('ready', DiscordController.ready);
        DiscordController.client.on('guildMemberUpdate', DiscordController.userUpdate);
        DiscordController.client.login(process.env.DISCORD_BOT);
    }

    static async ready() {
        Logger.info(`Discord Bot Connected Successfully`);

        if (DEFAULT_CONFIG.WHITELIST && !DiscordController.whitelistRole) {
            Logger.error(`.env file is missing WHITELIST_ROLE identifaction for auto-whitelist.`);
            return;
        }

        if (!process.env.DISCORD_SERVER_ID) {
            Logger.warning(`DISCORD_SERVER_ID is not defined. You will not be able to use messaging services.`);
            return;
        }

        DiscordController.guild = await DiscordController.client.guilds.fetch(process.env.DISCORD_SERVER_ID);
    }

    static async userUpdate(oldUser: Discord.GuildMember, newUser: Discord.GuildMember) {
        const oldUserHasRole = oldUser.roles.cache.has(process.env.WHITELIST_ROLE);
        const newUserHasRole = newUser.roles.cache.has(process.env.WHITELIST_ROLE);
        const name = `${newUser.user.username}#${newUser.user.discriminator}`;

        // Removed from White List
        if (oldUserHasRole && !newUserHasRole) {
            if (!OptionsController.removeFromWhitelist(newUser.user.id)) {
                return;
            }

            Logger.log(`${name} was removed from the whitelist.`);
            return;
        }

        // Added to White List
        if (!oldUserHasRole && newUserHasRole) {
            if (!OptionsController.addToWhitelist(newUser.user.id)) {
                Logger.warning(`${name} could not be added to the white list.`);
                return;
            }

            Logger.log(`${name} was added to the whitelist.`);
            return;
        }
    }

    /**
     * Send a message to a Discord Channel.
     * @static
     * @param {string} channel_id
     * @param {string} message
     * @return {*}
     * @memberof DiscordController
     */
    static sendToChannel(channel_id: string, message: string) {
        if (!DiscordController.guild) {
            Logger.error(`You do not currently have a Discord Bot Setup for sending messages.`);
            return;
        }

        const channel = DiscordController.guild.channels.cache.find((x) => x.id === channel_id) as Discord.TextChannel;
        if (!channel) {
            Logger.error(`Channel does not exist.`);
            return;
        }

        channel.send(message);
    }
}

if (DEFAULT_CONFIG.USE_DISCORD_BOT) {
    if (!process.env.DISCORD_BOT) {
        Logger.error(`.env is missing DISCORD_BOT secret for logging in. Don't forget to add WHITELIST_ROLE as well.`);
    } else {
        DiscordController.populateEndpoints();
    }
}
