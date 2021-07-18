import * as alt from 'alt-server';

import { CurrencyTypes } from '../../shared/enums/currency';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import atms from '../../shared/information/atms';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/Player';
import { BlipController } from '../systems/blip';
import { InteractionController } from '../systems/interaction';

class AtmFunctions {
    static init() {
        for (let i = 0; i < atms.length; i++) {
            const position = atms[i];

            BlipController.add({
                text: 'ATM',
                color: 11,
                sprite: 207,
                scale: 1,
                shortRange: true,
                pos: position,
                uid: `atm-${i}`
            });

            InteractionController.add({
                position,
                description: 'Open the ATM',
                type: 'atm',
                callback: (player: alt.Player) => {
                    alt.emitClient(player, SYSTEM_EVENTS.INTERACTION_ATM);
                }
            });
        }
    }

    static action(player: alt.Player, type: string, amount: string | number, id: null | number) {
        if (isNaN(amount as number)) {
            playerFuncs.sync.currencyData(player);
            return;
        }

        amount = parseFloat(amount as string);

        if (!amount || amount <= 0) {
            playerFuncs.sync.currencyData(player);
            return;
        }

        if (!ActionHandlers[type]) {
            playerFuncs.sync.currencyData(player);
            return;
        }

        const result = ActionHandlers[type](player, amount, id);
        playerFuncs.sync.currencyData(player);

        if (!result) {
            playerFuncs.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        } else {
            playerFuncs.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        }
    }

    static deposit(player: alt.Player, amount: number): boolean {
        if (player.data.cash < amount) {
            return false;
        }

        if (!playerFuncs.currency.sub(player, CurrencyTypes.CASH, amount)) {
            return false;
        }

        if (!playerFuncs.currency.add(player, CurrencyTypes.BANK, amount)) {
            return false;
        }

        return true;
    }

    static withdraw(player: alt.Player, amount: number): boolean {
        if (player.data.bank < amount) {
            return false;
        }

        if (!playerFuncs.currency.sub(player, CurrencyTypes.BANK, amount)) {
            return false;
        }

        if (!playerFuncs.currency.add(player, CurrencyTypes.CASH, amount)) {
            return false;
        }

        return true;
    }

    static transfer(player: alt.Player, amount: number, id: string | number): boolean {
        const target: alt.Player = [...alt.Player.all].find((x) => `${x.id}` === `${id}`);
        if (!target) {
            return false;
        }

        if (target.id === player.id) {
            return false;
        }

        if (amount > player.data.bank) {
            return false;
        }

        if (!playerFuncs.currency.sub(player, CurrencyTypes.BANK, amount)) {
            return false;
        }

        if (!playerFuncs.currency.add(target, CurrencyTypes.BANK, amount)) {
            return false;
        }

        const msg = LocaleController.get(LOCALE_KEYS.PLAYER_RECEIVED_BLANK, `$${amount}`, player.data.name);
        playerFuncs.emit.message(target, msg);
        return true;
    }

    static transferCash(player: alt.Player, amount: number, id: string | number): boolean {
        const target: alt.Player = [...alt.Player.all].find((x) => `${x.id}` === `${id}`);
        if (!target) {
            return false;
        }

        if (target.id === player.id) {
            return false;
        }

        if (amount > player.data.cash) {
            return false;
        }

        if (!playerFuncs.currency.sub(player, CurrencyTypes.CASH, amount)) {
            return false;
        }

        if (!playerFuncs.currency.add(target, CurrencyTypes.CASH, amount)) {
            return false;
        }

        const msg = LocaleController.get(LOCALE_KEYS.PLAYER_RECEIVED_BLANK, `$${amount}`, player.data.name);
        playerFuncs.emit.message(target, msg);
        return true;
    }
}

const ActionHandlers = {
    deposit: AtmFunctions.deposit,
    withdraw: AtmFunctions.withdraw,
    transfer: AtmFunctions.transfer,
    transferCash: AtmFunctions.transferCash
};

alt.on(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY, AtmFunctions.init);
alt.onClient(SYSTEM_EVENTS.INTERACTION_ATM_ACTION, AtmFunctions.action);
