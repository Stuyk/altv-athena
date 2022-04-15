import * as alt from 'alt-server';
import Database from '@stuyk/ezmongodb';
import { Collections } from '../../../../../server/interface/iDatabaseCollections';
import { LOCALE_KEYS } from '../../../../../shared/locale/languages/keys';
import { LocaleController } from '../../../../../shared/locale/locale';
import { Athena } from '../../../../../server/api/athena';

export async function makeAdminCmd(player: alt.Player, id: number | string, permissionLevel: number) {
    if (!player || !player.valid) {
        return;
    }
    const target = Athena.player.get.findByUid(id);
    if (!target) {
        Athena.player.emit.message(player, LocaleController.get(LOCALE_KEYS.CANNOT_FIND_PLAYER));
        return;
    }

    target.accountData.permissionLevel = permissionLevel;

    await Database.updatePartialData(
        target.accountData._id,
        { permissionLevel: target.accountData.permissionLevel },
        Collections.Accounts,
    );
    alt.logWarning(`(${target.data.name}) had their permission level changed to: ${permissionLevel}.`);
}
