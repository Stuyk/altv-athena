import alt from 'alt-server';
import Discord, { MessageEmbed } from 'discord.js';
import config from '../config';
import { OptionsController } from './OptionsController';

export class DiscordController {
    static client: Discord.Client = new Discord.Client({
        ws: { intents: new Discord.Intents(Discord.Intents.ALL) },
    });

    static whitelistRole = config?.whitelist.role ?? null;
    static guild: Discord.Guild;

    static populateEndpoints() {
        DiscordController.client.on('ready', DiscordController.ready);
        DiscordController.client.on('guildMemberUpdate', DiscordController.userUpdate);
        DiscordController.client.login(config.token);
    }

    static async ready() {
        alt.log(`~lg~[Discord] Bot Connected Successfully`);

        if (config?.whitelist?.enabled && !config?.whitelist?.role) {
            alt.logError(`[Discord] missing whitelist role for auto-whitelist.`);
            return;
        }

        if (!config.serverId) {
            alt.logWarning(`[Discord] No ServerId provided in config. You will not be able to use messaging services.`);
            return;
        }

        DiscordController.guild = await DiscordController.client.guilds.fetch(config.serverId);
    }

    /**
         * If the user was removed from the whitelist, remove them from the database. If the user was
        added to the whitelist, add them to the database.
         * @param {Discord.GuildMember} oldUser - The old user object.
         * @param {Discord.GuildMember} newUser - The user that was added or removed.
         * @returns The return value of the function is the value of the last expression evaluated. In
        this case, the return value is undefined.
         */
    static async userUpdate(oldUser: Discord.GuildMember, newUser: Discord.GuildMember) {
        const oldUserHasRole = oldUser.roles.cache.has(config.whitelist.role);
        const newUserHasRole = newUser.roles.cache.has(config.whitelist.role);
        const name = `${newUser.user.username}#${newUser.user.discriminator}`;

        // Removed from White List
        if (oldUserHasRole && !newUserHasRole) {
            if (!OptionsController.removeFromWhitelist(newUser.user.id)) {
                return;
            }

            alt.log(`[Discord] ${name} was removed from the whitelist.`);
            return;
        }

        // Added to White List
        if (!oldUserHasRole && newUserHasRole) {
            if (!OptionsController.addToWhitelist(newUser.user.id)) {
                alt.logWarning(`[Discord] ${name} could not be added to the white list.`);
                return;
            }

            alt.log(`[Discord] ${name} was added to the whitelist.`);
        }
    }

    /**
     * Send a message to a Discord channel.
     * @param {string} channel_id - The ID of the channel to send the message to.
     * @param {string} message - The message to send to the channel.
     * @returns The Discord.Guild object.
     */
    static sendToChannel(channel_id: string, message: string) {
        if (!DiscordController.guild) {
            alt.logError(`[Discord] You do not currently have a Discord Bot Setup for sending messages.`);
            return;
        }

        const channel = DiscordController.guild.channels.cache.find((x) => x.id === channel_id) as Discord.TextChannel;
        if (!channel) {
            alt.logError(`[Discord] Channel does not exist.`);
            return;
        }

        channel.send(message);
    }

    /**
     * Send a message to a Discord channel.
     * @param {string} channel_id - The ID of the channel to send the message to.
     * @param {MessageEmbed} msg - MessageEmbed - The message to send.
     * @returns The Discord.Guild object.
     */
    static sendEmbed(channel_id: string, msg: MessageEmbed) {
        if (!DiscordController.guild) {
            alt.logError(`[Discord] You do not currently have a Discord Bot Setup for sending messages.`);
            return;
        }

        const channel = DiscordController.guild.channels.cache.find((x) => x.id === channel_id) as Discord.TextChannel;
        if (!channel) {
            alt.logError(`[Discord] Channel does not exist.`);
            return;
        }

        channel.send(msg);
    }
}
