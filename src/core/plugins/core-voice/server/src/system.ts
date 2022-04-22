import * as alt from 'alt-server';
import { PlayerEvents } from '../../../../server/events/playerEvents';
import { IVoiceChannel } from '../../shared/interfaces';
import { ATHENA_EVENTS_PLAYER } from '../../../../shared/enums/athenaEvents';
import { VOICE_CONFIG } from '../../shared/src/config';
import { Athena } from '../../../../server/api/athena';

const Channels: Array<IVoiceChannel<alt.Player, alt.VoiceChannel>> = [];

export class VoiceSystem {
    /**
     * Initializes the main voice channel
     *
     * The main voice channel automatically handles dimensions by default.
     * @returns Nothing.
     */
    static init() {
        if (!VOICE_CONFIG.ENABLE_VOICE) {
            return;
        }

        // Initialize Main Channel
        if (Channels.findIndex((x) => x.name === VOICE_CONFIG.MAIN_VOICE_CHANNEL_NAME) <= -1) {
            VoiceSystem.createChannel(VOICE_CONFIG.MAIN_VOICE_CHANNEL_NAME, true, 25);
        }

        // Enable voice channel joining on character select, and add to main channel.
        PlayerEvents.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, (player: alt.Player) => {
            VoiceSystem.addPlayer(player, VOICE_CONFIG.MAIN_VOICE_CHANNEL_NAME);
        });

        // When a player disconnects, this will try to remove them from the main voice channel.
        alt.on('playerDisconnect', (player: alt.Player) => {
            VoiceSystem.removePlayer(player, VOICE_CONFIG.MAIN_VOICE_CHANNEL_NAME);
        });
    }

    /**
     * Create a channel with a name, that can be removed later.
     *
     * @static
     * @param {string} name
     * @param {boolean} isSpatial
     * @param {number} maxDistance
     * @memberof VoiceSystem
     */
    static createChannel(
        name: string,
        isSpatial: boolean,
        maxDistance: number,
    ): IVoiceChannel<alt.Player, alt.VoiceChannel> | null {
        const index = Channels.findIndex((x) => x.name === name);
        if (index <= -1) {
            return null;
        }

        const newChannel = {
            name,
            channel: new alt.VoiceChannel(isSpatial, maxDistance),
            joinEmits: [],
            leaveEmits: [],
        };

        Channels.push(newChannel);

        return newChannel;
    }

    /**
     * Get an IVoiceChannel
     *
     * @static
     * @param {string} name
     * @return {*}  {(IVoiceChannel<alt.Player, alt.VoiceChannel> | null)}
     * @memberof VoiceSystem
     */
    static getChannel(name: string): IVoiceChannel<alt.Player, alt.VoiceChannel> | null {
        const index = Channels.findIndex((x) => x.name === name);
        if (index <= -1) {
            return null;
        }

        return Channels[index];
    }

    /**
     * Removes a channel and all members in the voice channel.
     *
     * @static
     * @param {string} name
     * @return {*}
     * @memberof VoiceSystem
     */
    static removeChannel(name: string) {
        const index = Channels.findIndex((x) => x.name === name);
        if (index <= -1) {
            return;
        }

        if (Channels[index].channel) {
            Channels[index].channel.destroy();
        }

        Channels.splice(index, 1);
    }

    /**
     * Register an `emitClient` to invoke when a player joins a voice channel.
     *
     * @static
     * @param {string} eventName
     * @memberof VoiceSystem
     */
    static addClientJoinEmitToChannel(eventName: string, channelName: string): boolean {
        const index = Channels.findIndex((x) => x.name === channelName);
        if (index <= -1) {
            return false;
        }

        Channels[index].joinEmits.push(eventName);
        return true;
    }

    /**
     * Register an `emitClient` to invoke when a player leaves a voice channel.
     *
     * @static
     * @param {string} eventName
     * @memberof VoiceSystem
     */
    static addClientLeaveEmitToChannel(eventName: string, channelName: string): boolean {
        const index = Channels.findIndex((x) => x.name === channelName);
        if (index <= -1) {
            return false;
        }

        Channels[index].leaveEmits.push(eventName);
        return true;
    }

    /**
     * Adds a player to a voice channel
     * @param player - The player that joined the channel.
     * @returns Nothing.
     */
    static addPlayer(player: alt.Player, channelName: string) {
        const index = Channels.findIndex((x) => x.name === channelName);
        if (index <= -1) {
            return null;
        }

        const virtualChannel = Channels[index];
        if (virtualChannel.channel.isPlayerInChannel(player)) {
            return;
        }

        Athena.player.emit.message(player, `[Athena] You have joined the global voice server.`);
        virtualChannel.channel.addPlayer(player);

        // Sends multiple `emitClient` events based on events that were registered above.
        for (let i = 0; i < virtualChannel.joinEmits.length; i++) {
            alt.emitClient(player, virtualChannel.joinEmits[i], virtualChannel.name);
        }
    }

    /**
     * Remove a player from the voice channel
     * @param player - The player to remove from the voice channel.
     * @returns The `removePlayer` function returns nothing.
     */
    static removePlayer(player: alt.Player, channelName: string) {
        if (!player || !player.valid) {
            return;
        }

        const index = Channels.findIndex((x) => x.name === channelName);
        if (index <= -1) {
            return null;
        }

        const virtualChannel = Channels[index];
        if (virtualChannel.channel.isPlayerInChannel(player)) {
            return;
        }

        try {
            virtualChannel.channel.removePlayer(player);
        } catch (err) {
            alt.log(`[Athena] Could not remove null player from voice. Likely due to reconnect.`);
        }

        for (let i = 0; i < virtualChannel.leaveEmits.length; i++) {
            alt.emitClient(player, virtualChannel.leaveEmits[i], virtualChannel.name);
        }
    }
}
