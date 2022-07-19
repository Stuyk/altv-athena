import * as alt from 'alt-server';
import { PlayerEvents } from '../../../../server/events/playerEvents';
import { Global } from '../../../../server/systems/global';
import { ATHENA_EVENTS_PLAYER } from '../../../../shared/enums/athenaEvents';
import { BANK_CONFIG } from './config';
import * as charRef from '../../../../shared/interfaces/character';
import { Athena } from '../../../../server/api/athena';
import { StateManager } from '../../../../server/systems/stateManager';

const metaName = 'bankNumber';

// Extends the player interface.
declare module 'alt-server' {
    export interface Character extends Partial<charRef.Character> {
        [metaName]?: null | undefined | number;
    }
}

class InternalFunctions {
    static async handleSelect(player: alt.Player) {
        if (player.data.bankNumber !== undefined && player.data.bankNumber !== null) {
            Athena.player.emit.meta(player, metaName, player.data[metaName]);
            return;
        }

        // Increase the value outright
        await Global.increase(metaName, 1, BANK_CONFIG.BANK_ACCOUNT_START_NUMBER);
        const bankNumber = await Global.getKey<number>(metaName);
        StateManager.set(player, metaName, bankNumber);
        Athena.player.emit.meta(player, metaName, player.data[metaName]);
        alt.log(`Created Bank Account # ${player.data[metaName]} for ${player.data.name}`);
    }
}

export class BankAccountNumber {
    static init() {
        PlayerEvents.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, InternalFunctions.handleSelect);
    }
}
