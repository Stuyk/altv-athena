import * as alt from 'alt-server';
import { PERMISSIONS } from '../../shared/flags/PermissionFlags';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { playerFuncs } from '../extensions/Player';
import ChatController from '../systems/chat';
import { FactionInternalSystem } from '../systems/factionsInternal';

ChatController.addCommand('createfaction', 'creajfkldsa;fj', PERMISSIONS.ADMIN, handleCommand);

function handleCommand(player: alt.Player): void {
    FactionInternalSystem.create(player, { name: 'Whatever', pos: player.pos, logs: [] });
}
