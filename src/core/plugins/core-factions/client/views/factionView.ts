import * as alt from 'alt-client';
import { WebViewController } from '../../../../client/extensions/view2';
import { isAnyMenuOpen } from '../../../../client/utility/menus';
import { PLAYER_SYNCED_META } from '../../../../shared/enums/playerSynced';
import { VEHICLE_SYNCED_META } from '../../../../shared/enums/vehicleSyncedMeta';
import { FACTION_EVENTS } from '../../shared/factionEvents';
import { Faction } from '../../shared/interfaces';

const onOpen: Array<(view: alt.WebView, faction: Faction) => void> = [];
const onClose: Array<(view: alt.WebView, faction: Faction) => void> = [];
const onRefresh: Array<(faction: Faction) => void> = [];

let faction: Faction;
let isOpen = false;

class InternalFunctions {
    static async open(_faction: Faction) {
        faction = _faction;

        // Just updates faction data dynamically for users.
        if (isOpen) {
            InternalFunctions.ready();

            for (const element of onRefresh) {
                element(faction);
            }

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

        for (const element of onOpen) {
            element(view, faction);
        }

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

        if (!_faction) {
            InternalFunctions.close();
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

        for (const element of onClose) {
            element(view, faction);
        }

        WebViewController.closePages([FACTION_EVENTS.WEBVIEW.NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;
    }

    static async ready() {
        const view = await WebViewController.get();
        const vehicleList = InternalFunctions.getFactionVehicles(faction);

        view.emit(
            FACTION_EVENTS.WEBVIEW.UPDATE_DATA,
            faction,
            alt.Player.local.getSyncedMeta(PLAYER_SYNCED_META.DATABASE_ID),
            alt.Player.local.meta.cash + alt.Player.local.meta.bank,
            alt.Player.local.pos,
            alt.Player.local.rot,
            vehicleList,
        );
    }

    /**
     * Returns an array of matching spawned vehicles for the faction.
     *
     * @static
     * @param {Faction} faction
     * @return {*}
     * @memberof InternalFunctions
     */
    private static getFactionVehicles(factionRef: Faction) {
        const spawnedVehicles = [];

        const currentVehicles = [...alt.Vehicle.all];
        for (const element of currentVehicles) {
            if (!element.hasSyncedMeta(VEHICLE_SYNCED_META.DATABASE_ID)) {
                continue;
            }

            const id = element.getSyncedMeta(VEHICLE_SYNCED_META.DATABASE_ID);
            if (factionRef.vehicles.findIndex((veh) => veh.id === id) <= -1) {
                continue;
            }

            spawnedVehicles.push(id);
        }

        return spawnedVehicles;
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

    /**
     * Triggers a callback when the WebView is opening.
     * This is just after event registration.
     *
     * Useful for registering custom 'on' events.
     *
     * @static
     * @param {(view: alt.WebView) => void} callback
     * @memberof FactionView
     */
    static onOpen(callback: (view: alt.WebView, faction: Faction) => void) {
        onOpen.push(callback);
    }

    /**
     * Triggers a callback when the WebView is closed.
     *
     * Useful for registering custom 'off' events.
     *
     * @static
     * @param {(view: alt.WebView) => void} callback
     * @memberof FactionView
     */
    static onClose(callback: (view: alt.WebView, faction: Faction) => void) {
        onClose.push(callback);
    }

    /**
     * Called when data is updated from server-side and emitted to the faction members.
     *
     * @static
     * @param {(faction: Faction) => void} callback
     * @memberof FactionView
     */
    static onRefresh(callback: (faction: Faction) => void) {
        onRefresh.push(callback);
    }
}
