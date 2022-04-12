import * as alt from 'alt-shared';

export interface IVoiceChannel<Player, VoiceChannel> {
    /**
     * Name of the voice channel we're creating.
     *
     * @type {string}
     * @memberof IVoiceChannel
     */
    name: string;

    /**
     * When a player joins the voice channel. It will emit an event to the client for this player.
     *
     * @type {Array<string>}
     * @memberof IVoiceChannel
     */
    joinEmits: Array<string>;

    /**
     * When a player leaves the voice channel. It will emit an event to the client for this player.
     *
     * @type {Array<string>}
     * @memberof IVoiceChannel
     */
    leaveEmits: Array<string>;

    /**
     * A voice channel proxy, mocks alt.VoiceChannel on server-side.
     *
     * @memberof IVoiceChannel
     */
    channel?: VoiceChannel;
}
