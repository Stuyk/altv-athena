import * as alt from 'alt-server';
import ChatController from '../systems/chat';
import { CommandsLocale } from '../../shared/locale/commands';
import { CurrencyTypes } from '../../shared/enums/currency';
import { Permissions } from '../../shared/flags/permissions';

ChatController.addCommand('setcash', '/setcash [amount] [id]* - Add cash', Permissions.Admin, handleCommand);

function handleCommand(player: alt.Player, amount: string, id: string | null = null): void {
    if (id === null) {
        player.currency().setCurrency(CurrencyTypes.CASH, parseInt(amount));
        return;
    }

    const target: alt.Player = [...alt.Player.all].find((x) => `${x.id}` === `${id}`);
    if (!target) {
        player.emit().message(CommandsLocale.CANNOT_FIND_PLAYER);
        return;
    }

    target.currency().setCurrency(CurrencyTypes.CASH, parseInt(amount));
}
