import * as alt from 'alt-server';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import ChatController from '../systems/chat';
import { Permissions } from '../../shared/flags/permissions';
import { InteriorController } from '../systems/interior';
import { playerFuncs } from '../extensions/Player';
import { Interior } from '../../shared/interfaces/Interior';

const playerData = {};

ChatController.addCommand(
    'interiorcreate',
    LocaleController.get(LOCALE_KEYS.COMMAND_INTERIOR_CREATE, '/interiorcreate'),
    Permissions.Admin,
    handleCreate
);

ChatController.addCommand(
    'interioroutside',
    LocaleController.get(LOCALE_KEYS.COMMAND_INTERIOR_OUTSIDE, '/interioroutside'),
    Permissions.Admin,
    handleOutside
);

ChatController.addCommand(
    'interiorinside',
    LocaleController.get(LOCALE_KEYS.COMMAND_INTERIOR_INSIDE, '/interiorinside'),
    Permissions.Admin,
    handleInside
);

ChatController.addCommand(
    'interiordone',
    LocaleController.get(LOCALE_KEYS.COMMAND_INTERIOR_DONE, '/interiordone'),
    Permissions.Admin,
    handleDone
);

function handleCreate(player: alt.Player, name: string, isActuallyOutside: string): void {
    if (!name) {
        ChatController.getDescription('interiorcreate');
        return;
    }

    // Initialize / Erase Current Data
    playerData[player.id] = {
        name,
        isActuallyOutside: isActuallyOutside ? true : false
    };

    playerFuncs.emit.message(player, `Started interior creation process.`);
}

function handleOutside(player: alt.Player): void {
    playerData[player.id].outside = player.pos;
    playerFuncs.emit.message(player, `Set Outside Position`);
}

function handleInside(player: alt.Player): void {
    playerData[player.id].inside = player.pos;
    playerFuncs.emit.message(player, `Set Inside Position`);
}

async function handleDone(player: alt.Player): Promise<void> {
    if (!playerData[player.id].inside || !playerData[player.id].outside) {
        playerFuncs.emit.message(player, `Must set /interioroutside and /interiorinside!`);
        return;
    }

    const data = playerData[player.id] as Interior;
    const document = await InteriorController.create(player.data._id.toString(), data);
    if (!document) {
        playerFuncs.emit.message(player, `Something went wrong during interior creation process.`);
        return;
    }

    InteriorController.populate(document as Interior);
}
