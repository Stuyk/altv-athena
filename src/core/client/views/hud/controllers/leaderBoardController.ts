import * as alt from 'alt-client';

import { KEY_BINDS } from '../../../../shared/enums/KeyBinds';
import { PLAYER_SYNCED_META } from '../../../../shared/enums/PlayerSynced';
import { SYSTEM_EVENTS } from '../../../../shared/enums/System';
import { KeybindController } from '../../../events/keyup';
import { BaseHUD } from '../hud';

export class LeaderboardController {
    /**
     * Register the keybind to toggle the leaderboard.
     * @static
     * @memberof LeaderboardController
     */
    static registerKeybind() {
        KeybindController.registerKeybind({
            key: KEY_BINDS.LEADERBOARD,
            singlePress: LeaderboardController.focusLeaderBoard,
        });
    }

    /**
     * Change the state of the leaderboard from visible / invisible.
     * @static
     * @return {*}  {void}
     * @memberof LeaderboardController
     */
    static focusLeaderBoard(): void {
        if (!BaseHUD.view) {
            return;
        }

        if (alt.Player.local.isChatOpen) {
            return;
        }

        if (alt.Player.local.isMenuOpen) {
            return;
        }

        if (alt.Player.local.isLeaderboardOpen) {
            BaseHUD.view.emit('leaderboard:Toggle', [], false);
            alt.Player.local.isLeaderboardOpen = false;
            return;
        }

        const validPlayers = [];

        [...alt.Player.all].forEach((player) => {
            if (!player.hasSyncedMeta(PLAYER_SYNCED_META.PING)) {
                return;
            }

            const id = player.id;
            const name = player.getSyncedMeta(PLAYER_SYNCED_META.NAME);
            const ping = player.getSyncedMeta(PLAYER_SYNCED_META.PING);

            validPlayers.push({ id, name, ping });
        });

        alt.Player.local.isLeaderboardOpen = true;
        BaseHUD.view.emit('leaderboard:Toggle', validPlayers, true);
    }
}

alt.onceServer(SYSTEM_EVENTS.TICKS_START, LeaderboardController.registerKeybind);
