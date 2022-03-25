import * as alt from 'alt-server';
import { PlayerEvents } from '../../../server/events/playerEvents';
import { Global } from '../../../server/systems/global';
import { ATHENA_EVENTS_PLAYER } from '../../../shared/enums/athenaEvents';
import { BANK_CONFIG } from './config';
import * as charRef from '../../../shared/interfaces/character';
import { playerFuncs } from '../../../server/extensions/extPlayer';

// Extends the player interface.
declare module 'alt-server' {
    export interface Character extends Partial<charRef.Character> {
        bankNumber?: null | undefined | number;
    }
}

class InternalFunctions {
    static async handleSelect(player: alt.Player) {
        if (player.data.bankNumber !== undefined && player.data.bankNumber !== null) {
            return;
        }

        player.data.bankNumber = await Global.getKey<number>('bankNumber');
        await playerFuncs.save.field(player, 'bankNumber', player.data.bankNumber);
        await Global.increase('bankNumber', 1, BANK_CONFIG.BANK_ACCOUNT_START_NUMBER);
        alt.log(`Created Bank Account # ${player.data.bankNumber} for ${player.data.name}`);
    }
}

export class BankAccountNumber {
    static init() {
        PlayerEvents.on(ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER, InternalFunctions.handleSelect);
    }
}
