import * as alt from 'alt-server';
import { Permissions } from '../../shared/flags/permissions';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';

ChatController.addCommand(
    'wanted',
    LocaleController.get(LOCALE_KEYS.COMMAND_WANTED, '/wanted'),
    Permissions.Admin,
    handleCommand
);

function handleCommand(player: alt.Player, id: any = null, stars: any): void {
    if (id === null) {
        id = player.id;
    }

    if (stars === null) {
        stars = 0;
    } else {
        stars = parseInt(stars);
    }

    const target: alt.Player = [...alt.Player.all].find((x) => x.id.toString() === id);
    if (!target) {
        return;
    }

    playerFuncs.emit.message(player, `Wanted Level set to: ${stars}`);
    playerFuncs.set.wantedLevel(player, stars);
}
