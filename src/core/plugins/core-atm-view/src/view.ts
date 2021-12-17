import * as alt from 'alt-server';

import atms from '../../../shared/information/atms';
import { playerFuncs } from '../../../server/extensions/Player';
import { ServerBlipController } from '../../../server/systems/blip';
import { InteractionController } from '../../../server/systems/interaction';
import { ATM_INTERACTIONS } from '../../../shared-plugins/core-atm-view';
import { CurrencyTypes } from '../../../shared/enums/Currency';
import { LOCALE_KEYS } from '../../../shared/locale/languages/keys';
import { LocaleController } from '../../../shared/locale/locale';

class InternalFunctions {
    /**
     * Determines what function to call based on action passed.
     * @static
     * @param {alt.Player} player
     * @param {string} type
     * @param {(string | number)} amount
     * @param {(null | number)} id
     * @return {*}
     * @memberof InternalFunctions
     */
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

    /**
     * Deposit money into the players bank account from their cash.
     * @static
     * @param {alt.Player} player
     * @param {number} amount
     * @return {*}  {boolean}
     * @memberof InternalFunctions
     */
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

    /**
     * Withdraws bank balance to cash balance.
     * @static
     * @param {alt.Player} player
     * @param {number} amount
     * @return {*}  {boolean}
     * @memberof InternalFunctions
     */
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

    /**
     * Transfer bank from self to target player id.
     * @static
     * @param {alt.Player} player
     * @param {number} amount
     * @param {(string | number)} id
     * @return {*}  {boolean}
     * @memberof InternalFunctions
     */
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

    /**
     * Transfer cash from self to target player id.
     * @static
     * @param {alt.Player} player
     * @param {number} amount
     * @param {(string | number)} id
     * @return {*}  {boolean}
     * @memberof InternalFunctions
     */
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

export class AtmFunctions {
    static init() {
        for (let i = 0; i < atms.length; i++) {
            const position = atms[i];

            ServerBlipController.append({
                text: 'ATM',
                color: 11,
                sprite: 207,
                scale: 1,
                shortRange: true,
                pos: position,
                uid: `atm-${i}`,
            });

            InteractionController.add({
                position,
                description: 'Open the ATM',
                type: 'atm',
                callback: (player: alt.Player) => {
                    alt.emitClient(player, ATM_INTERACTIONS.OPEN);
                },
            });
        }
    }
}

const ActionHandlers = {
    deposit: InternalFunctions.deposit,
    withdraw: InternalFunctions.withdraw,
    transfer: InternalFunctions.transfer,
    transferCash: InternalFunctions.transferCash,
};

alt.onClient(ATM_INTERACTIONS.ACTION, InternalFunctions.action);
