import * as alt from 'alt-server';
import { PERMISSIONS } from '../../shared/flags/permissionFlags';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/extPlayer';
import ChatController from '../systems/chat';

ChatController.addCommand(
    'wanted',
    LocaleController.get(LOCALE_KEYS.COMMAND_WANTED, '/wanted'),
    PERMISSIONS.ADMIN,
    handleCommand,
);

function handleCommand(player: alt.Player, id: any = null, stars: any): void {
    if (id === null || id === undefined) {
        id = player.id;
    }

    if (stars === null) {
        stars = 0;
    }

    if (typeof stars === 'string') {
        stars = parseInt(stars);
    }

    if (stars >= 6) {
        stars = 5;
    }

    if (stars < 0) {
        stars = 0;
    }

    const target: alt.Player = [...alt.Player.all].find((x) => x.id.toString() === id);
    if (!target) {
        return;
    }

    playerFuncs.emit.message(player, `Wanted Level set to: ${stars}`);
    playerFuncs.set.wantedLevel(target, stars);
}
