import * as alt from 'alt-server';
import { Character } from '../../shared/interfaces/Character';
import { DiscordUser } from '../interface/DiscordUser';
import { Account } from '../interface/Account';

import currency from './playerFunctions/currency';
import dataUpdater from './playerFunctions/dataUpdater';
import emit from './playerFunctions/emit';
import inventory from './playerFunctions/inventory';
import createNew from './playerFunctions/new';
import safe from './playerFunctions/safe';
import save from './playerFunctions/save';
import select from './playerFunctions/select';
import set from './playerFunctions/setter';
import sync from './playerFunctions/sync';
import utility from './playerFunctions/utility';

declare module 'alt-server' {
    export interface Player {
        pendingLogin?: boolean; // Used when a player is pending login.
        discordToken?: string; // Used to assist with loggin in a player through oAuth2.
        needsQT?: boolean;
        hasModel?: boolean;
        currentCharacters: Array<Character>;
        pendingCharacterEdit?: boolean;
        pendingNewCharacter?: boolean;
        pendingCharacterSelect?: boolean;

        // Player Data
        accountData?: Partial<Account>; // Account Identifiers for Discord
        discord?: DiscordUser; // Discord Information
        data?: Partial<Character>; // Currently Selected Character

        // Anti
        acPosition?: alt.Vector3;
        acHealth?: number;
        acArmour?: number;

        // Status Effects
        nextDeathSpawn: number;
        nextPingTime: number;
        nextItemSync: number;

        // World Data
        gridSpace: number;
        currentWeather: string;
    }
}

export const playerFuncs = {
    currency,
    dataUpdater,
    emit,
    inventory,
    createNew,
    safe,
    save,
    select,
    set,
    sync,
    utility
};
