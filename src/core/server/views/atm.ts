import * as alt from 'alt-server';
import { System_Interaction } from '../../shared/enums/system';
import { CurrencyTypes } from '../../shared/enums/currency';

const ActionHandlers = {
    deposit: handleDeposit,
    withdraw: handleWithdraw,
    transfer: handleTransfer
};

alt.onClient(System_Interaction.ACTION, handleAction);

function handleAction(player: alt.Player, type: string, amount: string | number, id: null | number): void {
    if (isNaN(amount as number)) {
        player.sync().currencyData();
        return;
    }

    amount = parseInt(amount as string);

    if (!amount || amount <= 0) {
        player.sync().currencyData();
        return;
    }

    if (!ActionHandlers[type]) {
        player.sync().currencyData();
        return;
    }

    const result = ActionHandlers[type](player, amount, id);
    player.sync().currencyData();

    if (!result) {
        player.emit().soundFrontend('Hack_Failed', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
    } else {
        player.emit().soundFrontend('Hack_Success', 'DLC_HEIST_BIOLAB_PREP_HACKING_SOUNDS');
    }
}

function handleDeposit(player: alt.Player, amount: number): boolean {
    if (player.data.cash <= amount) {
        return false;
    }

    player.currency().sub(CurrencyTypes.CASH, amount);
    player.currency().add(CurrencyTypes.BANK, amount);

    return true;
}

function handleWithdraw(player: alt.Player, amount: number): boolean {
    if (player.data.bank < amount) {
        return false;
    }

    player.currency().add(CurrencyTypes.CASH, amount);
    player.currency().sub(CurrencyTypes.BANK, amount);

    return true;
}

function handleTransfer(player: alt.Player, amount: number, id: string | number): boolean {
    const target: alt.Player = [...alt.Player.all].find((x) => `${x.id}` === `${id}`);
    if (!target) {
        return false;
    }

    if (target === player) {
        return false;
    }

    player.currency().sub(CurrencyTypes.BANK, amount);
    target.currency().add(CurrencyTypes.BANK, amount);

    target.emit().message(`You received: ${amount} from ${player.data.name}.`);

    return true;
}
