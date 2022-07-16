import alt from 'alt-server';
import { Client, Guild, GuildMember, Intents, MessageEmbed, TextChannel } from 'discord.js';
import { Athena } from '../../../../server/api/athena';
import { Account } from '../../../../server/interface/iAccount';
import { LoginController } from '../../../../server/systems/login';
import { LOCALE_DISCORD_ALLOW_LIST } from '../config/locales';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let isReady = false;
let serverId: string;
let allowListRole: string;
let guild: Guild;

export class DiscordController {
    /**
     * Intialize the core functionality of the Discord Bot.
     *
     * @static
     * @param {string} _token
     * @param {string} _serverId
     * @memberof DiscordController
     */
    static init(_token: string, _serverId: string): void {
        serverId = _serverId;
        alt.on('playerConnect', DiscordController.earlyConnections);
        client.on('ready', DiscordController.ready);
        client.login(_token);
    }

    /**
     * Kicks users who connect to early before the discord bot is ready.
     *
     * @static
     * @param {alt.Player} player
     * @return {*}
     * @memberof DiscordController
     */
    static async earlyConnections(player: alt.Player): Promise<void> {
        if (isReady) {
            alt.off('playerConnect', DiscordController.earlyConnections);
            return;
        }

        player.kick(LOCALE_DISCORD_ALLOW_LIST.SERVER_STILL_WARMING_UP);
    }

    /**
     * Initialize the allow list to start listening for new members logging in.
     *
     * @static
     * @param {string} _allowListRole
     * @return {*}
     * @memberof DiscordController
     */
    static async initAllowList(_allowListRole: string): Promise<void> {
        if (!_allowListRole) {
            alt.log(`~lr~[Discord] Missing role identification for allow list.`);
            return;
        }

        allowListRole = _allowListRole;

        const role = await guild.roles.fetch(allowListRole);
        if (!role) {
            alt.log(`~lr~[Discord] Could not find the allow list role specified in config. Plugin disabled.`);
            client.destroy();
            return;
        }

        client.on('guildMemberUpdate', DiscordController.userUpdate);
        Athena.injections.login.tryLogin('login-try-account-begin', DiscordController.tryLogin);
    }

    /**
     * Called when the Discord Bot is Ready & Online
     *
     * @static
     * @return {*}
     * @memberof DiscordController
     */
    static async ready(): Promise<void> {
        alt.log(`~lg~[Discord] Bot Started`);

        guild = await client.guilds.fetch(serverId);

        if (!guild) {
            alt.log(`~lr~[Discord] Could not find the server id specified in config. Plugin disabled.`);
            client.destroy();
            return;
        }

        isReady = true;
    }

    /**
     * Determine if the discord bot is ready to handle requests...
     *
     * @static
     * @return {*}
     * @memberof DiscordController
     */
    static async isReady(): Promise<unknown> {
        return new Promise((resolve: Function) => {
            const interval = alt.setInterval(() => {
                if (!isReady) {
                    return;
                }

                resolve();
                alt.clearInterval(interval);
            }, 500);
        });
    }

    /**
     * Check if a user is currently allow listed on Discord.
     *
     * @static
     * @param {alt.Player} player
     * @param {Partial<Account>} _account
     * @return {*}
     * @memberof DiscordController
     */
    static async tryLogin(player: alt.Player, _account: Partial<Account>): Promise<boolean> {
        if (!player || !player.valid) {
            return false;
        }

        if (!player.discord || !player.discord.id) {
            player.kick(LOCALE_DISCORD_ALLOW_LIST.ACCOUNT_NOT_ACCESSIBLE);
            return false;
        }

        const member = guild.members.cache.get(player.discord.id);
        if (!member) {
            player.kick(LOCALE_DISCORD_ALLOW_LIST.USER_WAS_NOT_IN_DISCORD);
            return false;
        }

        const role = guild.roles.cache.get(allowListRole);
        if (!role) {
            player.kick(LOCALE_DISCORD_ALLOW_LIST.NO_ALLOW_LIST_ROLE);
            return false;
        }

        const hasRole = member.roles.cache.get(allowListRole);
        if (!hasRole) {
            player.kick(LOCALE_DISCORD_ALLOW_LIST.NOT_ALLOW_LISTED);
            return false;
        }

        return true;
    }

    /**
     * If the user was removed from the allow list, kick them from the alt:v server if they are logged in.
     * @param {GuildMember} oldUser - The old user object.
     * @param {GuildMember} newUser - The user that was added or removed.
     * @returns The return value of the function is the value of the last expression evaluated. In
     * this case, the return value is undefined.
     */
    static async userUpdate(oldUser: GuildMember, newUser: GuildMember): Promise<void> {
        const discord = oldUser.id;
        const oldUserHasRole = oldUser.roles.cache.has(allowListRole);
        const newUserHasRole = newUser.roles.cache.has(allowListRole);
        const name = `${newUser.user.username}#${newUser.user.discriminator}`;

        // Removed from Allow List
        if (oldUserHasRole && !newUserHasRole) {
            alt.log(`~lc~[Discord] ${name} (${discord}) was removed from the allow list.`);
            await DiscordController.removeFromAllowList(discord, true);
            return;
        }

        // Added to Allow List
        if (!oldUserHasRole && newUserHasRole) {
            alt.log(`~lc~[Discord] ${name} (${discord}) was added to the allow list.`);
            await DiscordController.addToAllowList(oldUser.id, true);
        }
    }

    /**
     * Remove a discord member from the allow list.
     * Kicks the user if they are currently logged in.
     *
     * @static
     * @param {string} discord
     * @param {boolean} [alreadyRemovedRole=false]
     * @return {*}
     * @memberof DiscordController
     */
    static async removeFromAllowList(discord: string, alreadyRemovedRole: boolean = false): Promise<GuildMember> {
        const member = await guild.members.fetch(discord);

        try {
            await member.send(LOCALE_DISCORD_ALLOW_LIST.REMOVE_FROM_ALLOW_LIST);
        } catch (err) {
            alt.log(`~lr~[Discord] An Error occured! ${err}`);
        }

        const existingPlayer = alt.Player.all.find((p) => p && p.accountData && p.accountData.discord === discord);
        if (existingPlayer) {
            existingPlayer.kick(LOCALE_DISCORD_ALLOW_LIST.REMOVE_FROM_ALLOW_LIST);
        }

        if (alreadyRemovedRole) {
            return member;
        }

        if (!member) {
            return member;
        }

        // Remove the users role
        const role = await guild.roles.fetch(allowListRole);
        if (!role) {
            return member;
        }

        return await member.roles.remove(role);
    }

    /**
     * Add a discord member to the allow list.
     * Returns a GuildMember object if successful.
     *
     * @static
     * @param {string} discord
     * @return {Promise<boolean>}
     * @memberof DiscordController
     */
    static async addToAllowList(discord: string, justMessage: boolean = false): Promise<GuildMember> {
        // Find the user in discord
        const member = await guild.members.fetch(discord);
        if (!member) {
            return null;
        }

        const hasRole = member.roles.cache.has(allowListRole);
        if (hasRole) {
            return member;
        }

        try {
            await member.send(LOCALE_DISCORD_ALLOW_LIST.ADD_TO_ALLOW_LIST);
        } catch (err) {
            alt.log(`~lr~[Discord] An Error Occured! ${err}`);
        }

        // Add role if not just sending message.
        if (!justMessage) {
            await member.roles.add(allowListRole);
        }

        return member;
    }

    /**
     * Send a message to a Discord channel.
     * @param {string} channel_id - The ID of the channel to send the message to.
     * @param {string} message - The message to send to the channel.
     * @returns The Guild object.
     */
    static async sendToChannel(channel_id: string, message: string): Promise<void> {
        if (!guild) {
            alt.logError(`~lr~[Discord] You do not currently have a Discord Bot Setup for sending messages.`);
            return;
        }

        const channel = (await guild.channels.fetch(channel_id)) as TextChannel;
        if (!channel) {
            alt.logError(`~lr~[Discord] Channel does not exist to sendToChannel`);
            return;
        }

        channel.send(message);
    }

    /**
     * Send a message to a Discord channel.
     * @param {string} channel_id - The ID of the channel to send the message to.
     * @param {MessageEmbed} msg - MessageEmbed - The message to send.
     * @returns The Guild object.
     */
    static async sendEmbed(channel_id: string, msg: MessageEmbed): Promise<void> {
        if (!guild) {
            alt.logError(`[Discord] You do not currently have a Discord Bot Setup for sending messages.`);
            return;
        }

        const channel = (await guild.channels.fetch(channel_id)) as TextChannel;
        if (!channel) {
            alt.logError(`[Discord] Channel does not exist.`);
            return;
        }

        channel.send({ embeds: [msg] });
    }
}
