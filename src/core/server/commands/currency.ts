import * as alt from 'alt-server';
import ChatController from '../systems/chat';

import { CurrencyTypes } from '../../shared/enums/currency';
import { Permissions } from '../../shared/flags/permissions';
import { playerFuncs } from '../extensions/Player';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';

ChatController.addCommand(
    'setcash',
    LocaleController.get(LOCALE_KEYS.COMMAND_SET_CASH, '/setcash'),
    Permissions.Admin,
    handleCommand
);

function handleCommand(player: alt.Player, amount: string, id: string | null = null): void {
    if (id === null) {
        playerFuncs.currency.set(player, CurrencyTypes.CASH, parseInt(amount));
        return;
    }

    const target: alt.Player = [...alt.Player.all].find((x) => `${x.id}` === `${id}`);
    if (!target) {
        playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_FIND_PLAYER));
        return;
    }

    playerFuncs.currency.set(target, CurrencyTypes.CASH, parseInt(amount));
}
