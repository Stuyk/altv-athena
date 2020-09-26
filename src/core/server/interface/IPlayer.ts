import * as alt from 'alt-server';

export interface IPlayer extends alt.Player {
    pendingLogin: boolean; // Used when a player is pending login.
    discordToken: string; // Used to assist with loggin in a player through oAuth2.
}
