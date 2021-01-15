import * as alt from 'alt-client';
import { distance2d } from '../../../../shared/utility/vector';
import { BaseHUD } from '../hud';

export class LeaderboardController {
    static focusLeaderBoard(): void {
        if (!BaseHUD.view) {
            return;
        }

        if (alt.Player.local.isMenuOpen) {
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

        BaseHUD.view.emit('leaderboard:Toggle', validPlayers);
    }
}
