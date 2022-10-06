import * as alt from 'alt-server';
import { ServerAPI } from '../../../../server';
import { SharedAPI } from '../../../../shared';
import { BANK_CONFIG } from '../../shared/config';

const metaName = 'bankNumber';

// Extends the player interface.
declare module 'alt-server' {
    export interface Character extends Partial<SharedAPI.interfaces.Character> {
        [metaName]?: null | undefined | number;
    }
}

class InternalFunctions {
    static async handleSelect(player: alt.Player) {
        if (player.data.bankNumber !== undefined && player.data.bankNumber !== null) {
            ServerAPI.Athena.player.emit.meta(player, metaName, player.data[metaName]);
            return;
        }

        // Increase the value outright
        await ServerAPI.systems.Global.increase(metaName, 1, BANK_CONFIG.BANK_ACCOUNT_START_NUMBER);
        const bankNumber = await ServerAPI.systems.Global.getKey<number>(metaName);
        ServerAPI.systems.StateManager.set(player, metaName, bankNumber);
        ServerAPI.Athena.player.emit.meta(player, metaName, player.data[metaName]);
        alt.log(`Created Bank Account # ${player.data[metaName]} for ${player.data.name}`);
    }
}

export class BankAccountNumber {
    static init() {
        ServerAPI.events.PlayerEvents.on(
            SharedAPI.enums.ATHENA_EVENTS_PLAYER.SELECTED_CHARACTER,
            InternalFunctions.handleSelect,
        );
    }
}
