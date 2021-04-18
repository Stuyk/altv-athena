import * as alt from 'alt-client';
import { distance2d } from '../../../../shared/utility/vector';
import { BaseHUD } from '../hud';

export class LeaderboardController {
    static focusLeaderBoard(): void {
        if (!BaseHUD.view) {
            return;
        }

        if (alt.Player.local.isChatOpen) {
            return;
        }

        if (alt.Player.local.isPhoneOpen) {
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
