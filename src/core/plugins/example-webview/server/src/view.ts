import * as alt from 'alt-server';
import { Athena } from '../../../../server/api/athena';
import { command } from '../../../../server/decorators/commands';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';
import { isFlagEnabled } from '../../../../shared/utility/flags';
import { ExPlayerInfo } from '../../shared/interfaces';
import { ExampleWebViewEvents } from '../../shared/viewInfo';

export class ExampleWebViewServer {
    static init() {
        console.log(`Commands for Example WebView Created`);
        alt.onClient(ExampleWebViewEvents.WebViewToServer.KICK_PLAYER, ExampleWebViewServer.handleKickPlayer);
        alt.onClient(ExampleWebViewEvents.WebViewToServer.REQUEST_REFRESH, ExampleWebViewServer.handleRefresh);
    }

    @command('examplewebview', '/examplewebview - Just an Example', PERMISSIONS.ADMIN)
    static handleCommand(player: alt.Player) {
        alt.emitClient(player, ExampleWebViewEvents.ClientServer.OPEN, ExampleWebViewServer.getAvailablePlayers());
    }

    private static handleRefresh(player: alt.Player) {
        console.log('got refresh event');

        Athena.webview.emit(
            player,
            ExampleWebViewEvents.ServerToWebView.REFRESH_PLAYERS,
            ExampleWebViewServer.getAvailablePlayers(),
        );
    }

    private static handleKickPlayer(player: alt.Player, idToKick: number) {
        if (!isFlagEnabled(player.accountData.permissionLevel, PERMISSIONS.ADMIN)) {
            return;
        }

        const target = Athena.systems.identifier.getPlayer(idToKick);
        if (!target || !target.valid) {
            return;
        }

        target.kick(`Kicked by Example Panel`);
        ExampleWebViewServer.handleRefresh(player);
    }

    private static getAvailablePlayers(): Array<ExPlayerInfo> {
        return [...alt.Player.all]
            .filter((x) => x.valid && x.data && x.data._id)
            .map((t) => {
                const id = Athena.systems.identifier.getIdByStrategy(t);
                return {
                    id,
                    name: t.data.name,
                    ping: t.ping,
                };
            });
    }
}
