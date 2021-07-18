import * as alt from 'alt-client';
import { View_Events_Garage } from '../../shared/enums/views';
import { Vehicle } from '../../shared/interfaces/Vehicle';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { View } from '../extensions/view';
import ViewModel from '../models/ViewModel';
import { isAnyMenuOpen } from '../utility/menus';
import { BaseHUD } from './hud/hud';

const url = `http://assets/webview/client/garage/index.html`;
let view: View;
let vehicles: Partial<Vehicle>[];

class GarageView implements ViewModel {
    /**
     * Displays the Garage WebView to the client if available.
     * @static
     * @param {Partial<Vehicle>[]} _vehicles
     * @memberof GarageView
     */
    static async show(_vehicles: Partial<Vehicle>[]): Promise<void> {
        vehicles = _vehicles;

        if (isAnyMenuOpen()) {
            return;
        }

        view = await View.getInstance(url, true, false, true);
        view.on('garage:Ready', GarageView.ready);
        view.on('garage:Close', GarageView.close);
        view.on('garage:Spawn', GarageView.spawn);
        view.on('garage:Despawn', GarageView.despawn);
        alt.toggleGameControls(false);
        BaseHUD.setHudVisibility(false);
    }

    static close() {
        alt.toggleGameControls(true);
        BaseHUD.setHudVisibility(true);

        if (!view) {
            return;
        }

        view.close();
        view = null;
    }

    static ready() {
        view.emit('garage:SetLocale', LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_GARAGE));
        view.emit('garage:SetVehicles', vehicles);
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
