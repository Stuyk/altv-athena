import * as alt from 'alt-client';
import { WebViewController } from '../../../../client/extensions/view2';
import ViewModel from '../../../../client/models/viewModel';
import { isAnyMenuOpen } from '../../../../client/utility/menus';
import { PLAYER_SYNCED_META } from '../../../../shared/enums/playerSynced';
import { FACTION_EVENTS } from '../../shared/factionEvents';
import { Faction } from '../../shared/interfaces';

let faction: Faction;
let isOpen = false;

class InternalFunctions {
    static async open(_faction: Faction) {
        faction = _faction;

        // Just updates faction data dynamically for users.
        if (isOpen) {
            InternalFunctions.ready();
            return;
        }

        if (isAnyMenuOpen()) {
            return;
        }

        isOpen = true;

        // Must always be called first if you want to hide HUD.
        await WebViewController.setOverlaysVisible(false);

        const view = await WebViewController.get();
        view.on(FACTION_EVENTS.WEBVIEW.READY, InternalFunctions.ready);
        view.on(FACTION_EVENTS.WEBVIEW.CLOSE, InternalFunctions.close);
        view.on(FACTION_EVENTS.WEBVIEW.ACTION, InternalFunctions.action);

        WebViewController.openPages([FACTION_EVENTS.WEBVIEW.NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);

        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
    }

    static refresh(_faction: Faction) {
        if (!isOpen) {
            return;
        }

        faction = _faction;
        InternalFunctions.ready();
    }

    static async close() {
        isOpen = false;
        faction = null;

        alt.toggleGameControls(true);
        WebViewController.setOverlaysVisible(true);

        const view = await WebViewController.get();
        view.off(FACTION_EVENTS.WEBVIEW.READY, InternalFunctions.ready);
        view.off(FACTION_EVENTS.WEBVIEW.CLOSE, InternalFunctions.close);
        view.off(FACTION_EVENTS.WEBVIEW.ACTION, InternalFunctions.action);

        WebViewController.closePages([FACTION_EVENTS.WEBVIEW.NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;
    }

    static async ready() {
        const view = await WebViewController.get();
        view.emit(
            FACTION_EVENTS.WEBVIEW.UPDATE_DATA,
            faction,
            alt.Player.local.getSyncedMeta(PLAYER_SYNCED_META.DATABASE_ID),
            alt.Player.local.meta.cash + alt.Player.local.meta.bank,
        );
    }

    static action(functionName: string, ...args: any[]) {
        alt.emitServer(FACTION_EVENTS.PROTOCOL.INVOKE, functionName, ...args);
    }
}

export class FactionView {
    static init() {
        alt.onServer(FACTION_EVENTS.PROTOCOL.OPEN, InternalFunctions.open);
        alt.onServer(FACTION_EVENTS.PROTOCOL.REFRESH, InternalFunctions.refresh);
    }
}
