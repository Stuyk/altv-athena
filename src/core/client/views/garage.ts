import * as alt from 'alt-client';
import { View_Events_Garage } from '../../shared/enums/Views';
import { IVehicle } from '../../shared/interfaces/IVehicle';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { WebViewController } from '../extensions/view2';
import ViewModel from '../models/ViewModel';
import { isAnyMenuOpen } from '../utility/menus';

const PAGE_NAME = 'Garage';

let vehicles: Partial<IVehicle>[];

class GarageView implements ViewModel {
    /**
     * Displays the Garage WebView to the client if available.
     * @static
     * @param {Partial<Vehicle>[]} _vehicles
     * @memberof GarageView
     */
    static async show(_vehicles: IVehicle[]): Promise<void> {
        vehicles = _vehicles;

        if (isAnyMenuOpen()) {
            return;
        }

        // Must always be called first if you want to hide HUD.
        await WebViewController.setOverlaysVisible(false);

        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Ready`, GarageView.ready);
        view.on(`${PAGE_NAME}:Close`, GarageView.close);
        view.on(`${PAGE_NAME}:Spawn`, GarageView.spawn);
        view.on(`${PAGE_NAME}:Despawn`, GarageView.despawn);
        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);
        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
    }

    static async close() {
        alt.toggleGameControls(true);

        WebViewController.setOverlaysVisible(true);

        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Ready`, GarageView.ready);
        view.off(`${PAGE_NAME}:Close`, GarageView.close);
        view.off(`${PAGE_NAME}:Spawn`, GarageView.spawn);
        view.off(`${PAGE_NAME}:Despawn`, GarageView.despawn);

        WebViewController.closePages([PAGE_NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;
    }

    static async ready() {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:SetLocale`, LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_GARAGE));
        view.emit(`${PAGE_NAME}:SetVehicles`, vehicles);
    }

    static spawn(uid: string) {
        alt.emitServer(View_Events_Garage.Spawn, uid);
    }

    static despawn(uid: string) {
        alt.emitServer(View_Events_Garage.Despawn, uid);
    }
}

alt.onServer(View_Events_Garage.Open, GarageView.show);
alt.onServer(View_Events_Garage.Close, GarageView.close);
