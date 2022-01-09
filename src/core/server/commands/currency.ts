import * as alt from 'alt-server';
import ChatController from '../systems/chat';

import { CurrencyTypes } from '../../shared/enums/currency';
import { PERMISSIONS } from '../../shared/flags/permissionFlags';
import { playerFuncs } from '../extensions/extPlayer';
import { LocaleController } from '../../shared/locale/locale';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';

ChatController.addCommand(
    'setcash',
    LocaleController.get(LOCALE_KEYS.COMMAND_SET_CASH, '/setcash'),
    PERMISSIONS.ADMIN,
    handleCommand,
);

function handleCommand(player: alt.Player, amount: string, id: string | null = null): void {
    if (id === null || id === undefined) {
        playerFuncs.currency.set(player, CurrencyTypes.CASH, parseInt(amount));
        return;
    }

    const target = playerFuncs.get.findByUid(id);
    if (!target) {
        playerFuncs.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_FIND_PLAYER));
        return;
    }

    playerFuncs.currency.set(target, CurrencyTypes.CASH, parseInt(amount));
}
