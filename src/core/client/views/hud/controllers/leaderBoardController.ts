import * as alt from 'alt-client';
import { KEY_BINDS } from '../../../../shared/enums/keybinds';
import { SYSTEM_EVENTS } from '../../../../shared/enums/system';
import { distance2d } from '../../../../shared/utility/vector';
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
            singlePress: LeaderboardController.focusLeaderBoard
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

        const validPlayers = [...alt.Player.all]
            .filter((p) => p.getSyncedMeta('Ping'))
            .map((p) => {
                return {
                    id: p.id,
                    name: p.getSyncedMeta('Name'),
                    ping: p.getSyncedMeta('Ping'),
                    distance: distance2d(alt.Player.local.pos, p.getSyncedMeta('Position'))
                };
            })
            .sort((a, b) => a.distance - b.distance);

        alt.Player.local.isLeaderboardOpen = true;
        BaseHUD.view.emit('leaderboard:Toggle', validPlayers, true);
    }
}

alt.onceServer(SYSTEM_EVENTS.TICKS_START, LeaderboardController.registerKeybind);
