import * as alt from 'alt-server';
import { SharedAPI } from '../../../../shared';
import { ServerAPI } from '../../../../server';
import { ATM_INTERACTIONS } from '../../shared/events';

const INTERACTION_RANGE = 1.5;
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
            ServerAPI.Athena.player.sync.currencyData(player);
            return;
        }

        amount = parseFloat(amount as string);

        if (!amount || amount <= 0) {
            ServerAPI.Athena.player.sync.currencyData(player);
            return;
        }

        if (!ActionHandlers[type]) {
            ServerAPI.Athena.player.sync.currencyData(player);
            return;
        }

        const result = ActionHandlers[type](player, amount, id);
        ServerAPI.Athena.player.sync.currencyData(player);

        if (!result) {
            ServerAPI.Athena.player.emit.soundFrontend(player, 'Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
        } else {
            ServerAPI.Athena.player.emit.soundFrontend(player, 'Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
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

        if (!ServerAPI.Athena.player.currency.sub(player, SharedAPI.enums.CurrencyTypes.CASH, amount)) {
            return false;
        }

        if (!ServerAPI.Athena.player.currency.add(player, SharedAPI.enums.CurrencyTypes.BANK, amount)) {
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

        if (!ServerAPI.Athena.player.currency.sub(player, SharedAPI.enums.CurrencyTypes.BANK, amount)) {
            return false;
        }

        if (!ServerAPI.Athena.player.currency.add(player, SharedAPI.enums.CurrencyTypes.CASH, amount)) {
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
    static async transfer(player: alt.Player, amount: number, bankNumber: string | number): Promise<boolean> {
        if (typeof bankNumber === 'string') {
            bankNumber = parseInt(bankNumber);
        }

        // Check they are not transferring to self.
        if (player.data.bankNumber === bankNumber) {
            return false;
        }

        const onlinePlayer = [...alt.Player.all].find(
            (target) => target && target.data && target.data.bankNumber === bankNumber,
        );

        if (amount > player.data.bank) {
            return false;
        }

        if (onlinePlayer) {
            // Update by Online Player Route
            if (!ServerAPI.Athena.player.currency.sub(player, SharedAPI.enums.CurrencyTypes.BANK, amount)) {
                return false;
            }

            if (!ServerAPI.Athena.player.currency.add(onlinePlayer, SharedAPI.enums.CurrencyTypes.BANK, amount)) {
                return false;
            }

            const msg = SharedAPI.locale.LocaleController.get(
                SharedAPI.locale.languages.LOCALE_KEYS.PLAYER_RECEIVED_BLANK,
                `$${amount}`,
                player.data.name,
            );
            ServerAPI.Athena.player.emit.message(onlinePlayer, msg);
        } else {
            // Update by Document Route
            const document = await ServerAPI.Athena.database.funcs.fetchData<SharedAPI.interfaces.Character>(
                'bankNumber',
                bankNumber,
                ServerAPI.interfaces.Collections.Characters,
            );
            if (!document) {
                return false;
            }

            if (!ServerAPI.Athena.player.currency.sub(player, SharedAPI.enums.CurrencyTypes.BANK, amount)) {
                return false;
            }

            document.bank += amount;
            await ServerAPI.Athena.database.funcs.updatePartialData(
                document._id.toString(),
                { bank: document.bank },
                ServerAPI.interfaces.Collections.Characters,
            );
        }

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

        if (!ServerAPI.Athena.player.currency.sub(player, SharedAPI.enums.CurrencyTypes.CASH, amount)) {
            return false;
        }

        if (!ServerAPI.Athena.player.currency.add(target, SharedAPI.enums.CurrencyTypes.CASH, amount)) {
            return false;
        }

        const msg = SharedAPI.locale.LocaleController.get(
            SharedAPI.locale.languages.LOCALE_KEYS.PLAYER_RECEIVED_BLANK,
            `$${amount}`,
            player.data.name,
        );
        ServerAPI.Athena.player.emit.message(target, msg);
        return true;
    }
}

export class AtmFunctions {
    /**
     * Create blips for all ATMs and add an interaction to them.
     */
    static init() {
        for (let i = 0; i < SharedAPI.information.atms.length; i++) {
            const position = SharedAPI.information.atms[i];

            ServerAPI.systems.ServerBlipController.append({
                text: 'ATM',
                color: 11,
                sprite: 207,
                scale: 1,
                shortRange: true,
                pos: position,
                uid: `atm-${i}`,
            });

            ServerAPI.systems.InteractionController.add({
                position,
                description: 'Access ATM',
                range: INTERACTION_RANGE,
                callback: (player: alt.Player) => {
                    alt.emitClient(player, ATM_INTERACTIONS.OPEN);
                },
                isPlayerOnly: true,
                debug: false,
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
