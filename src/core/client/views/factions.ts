import * as alt from 'alt-client';
import { KEY_BINDS } from '../../shared/enums/keyBinds';
import { View_Events_Factions } from '../../shared/enums/views';
import { KeybindController } from '../events/keyup';
import { View } from '../extensions/view';
import ViewModel from '../models/viewModel';
import { isAnyMenuOpen } from '../utility/menus';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { IFactionClient } from '../../shared/interfaces/iFactionClient';
import { FACTION_PERMISSION_FLAGS } from '../../shared/flags/factionPermissionFlags';
import { IResponse } from '../../shared/interfaces/iResponse';
import { WebViewController } from '../extensions/view2';

const url = `http://assets/webview/client/factions/index.html`;
let view: View;
let faction: IFactionClient;

/**
 * Do Not Export Internal Only
 */
class FactionsView implements ViewModel {
    static init() {
        KeybindController.registerKeybind({
            key: KEY_BINDS.FACTIONS,
            singlePress: () => {
                alt.emitServer(View_Events_Factions.Open);
            },
        });
    }

    static async show(_faction: IFactionClient): Promise<void> {
        faction = _faction;

        if (isAnyMenuOpen()) {
            return;
        }

        // Must always be called first if you want to hide HUD.
        await WebViewController.setOverlaysVisible(false);

        view = await View.getInstance(url, true, false, true);
        view.on('factions:Ready', FactionsView.ready);
        view.on('factions:GetCurrency', FactionsView.getCurrency);
        view.on(View_Events_Factions.Close, FactionsView.close);
        view.on(View_Events_Factions.Bus, FactionsView.bus);
        alt.toggleGameControls(false);
    }

    static close() {
        alt.toggleGameControls(true);
        WebViewController.setOverlaysVisible(true);
        alt.emitServer(View_Events_Factions.Close);

        if (!view) {
            return;
        }

        view.close();
        view = null;
    }

    static getCurrency() {
        view.emit('factions:SetCurrency', alt.Player.local.meta.bank + alt.Player.local.meta.cash);
    }

    static update(_faction: IFactionClient = null) {
        if (_faction) {
            faction = _faction;
        }

        if (!view) {
            return;
        }

        view.emit('factions:SetFaction', faction);
    }

    static ready() {
        console.log(JSON.stringify(faction, null, '\t'));
        view.emit('factions:SetLocale', null);
        view.emit('factions:SetFaction', faction);
        view.emit('factions:SetFlags', FACTION_PERMISSION_FLAGS);
    }

    static bus(eventName: View_Events_Factions, ...args: any[]) {
        alt.emitServer(View_Events_Factions.Bus, eventName, ...args);
    }

    static response(response: IResponse) {
        if (!response) {
            return;
        }

        if (!view) {
            return;
        }

        view.emit('factions:Response', response);
    }
}

alt.onServer(SYSTEM_EVENTS.TICKS_START, FactionsView.init);
alt.onServer(View_Events_Factions.Update, FactionsView.update);
alt.onServer(View_Events_Factions.Open, FactionsView.show);
alt.onServer(View_Events_Factions.Response, FactionsView.response);
alt.onServer(View_Events_Factions.Close, FactionsView.close);
