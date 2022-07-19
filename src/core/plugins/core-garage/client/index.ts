import * as alt from 'alt-client';
import { WebViewController } from '../../../client/extensions/view2';
import ViewModel from '../../../client/models/viewModel';
import { isAnyMenuOpen } from '../../../client/utility/menus';
import { IVehicle } from '../../../shared/interfaces/iVehicle';
import { GARAGE_INTERACTIONS } from '../shared/events';
import { LOCALE_GARAGE_VIEW } from '../shared/locales';

const PAGE_NAME = 'Garage';

let vehicles: Partial<IVehicle>[];

/**
 * Do Not Export Internal Only
 */
class InternalFunctions implements ViewModel {
    /**
     * Displays the Garage WebView to the client if available.
     * @static
     * @param {Partial<Vehicle>[]} _vehicles
     * @memberof InternalFunctions
     */
    static async show(_vehicles: IVehicle[]): Promise<void> {
        vehicles = _vehicles;

        if (isAnyMenuOpen()) {
            return;
        }

        // Must always be called first if you want to hide HUD.
        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
        view.on(`${PAGE_NAME}:Spawn`, InternalFunctions.spawn);
        view.on(`${PAGE_NAME}:Despawn`, InternalFunctions.despawn);
        WebViewController.openPages(PAGE_NAME, true, InternalFunctions.close);
        WebViewController.focus();
        WebViewController.showCursor(true);
        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
    }

    static async close() {
        alt.toggleGameControls(true);

        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Ready`, InternalFunctions.ready);
        view.off(`${PAGE_NAME}:Spawn`, InternalFunctions.spawn);
        view.off(`${PAGE_NAME}:Despawn`, InternalFunctions.despawn);

        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;
    }

    static async ready() {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:SetLocale`, LOCALE_GARAGE_VIEW);
        view.emit(`${PAGE_NAME}:SetVehicles`, vehicles);
    }

    static spawn(uid: string) {
        alt.emitServer(GARAGE_INTERACTIONS.SPAWN, uid);
    }

    static despawn(uid: string) {
        alt.emitServer(GARAGE_INTERACTIONS.DESPAWN, uid);
    }
}

alt.onServer(GARAGE_INTERACTIONS.OPEN, InternalFunctions.show);
alt.onServer(GARAGE_INTERACTIONS.CLOSE, InternalFunctions.close);
