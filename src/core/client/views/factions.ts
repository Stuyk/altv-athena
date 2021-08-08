import * as alt from 'alt-client';
import { KEY_BINDS } from '../../shared/enums/keybinds';
import { View_Events_Factions } from '../../shared/enums/views';
import { KeybindController } from '../events/keyup';
import { View } from '../extensions/view';
import ViewModel from '../models/ViewModel';
import { isAnyMenuOpen } from '../utility/menus';
import { BaseHUD } from './hud/hud';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { IFactionClient } from '../../shared/interfaces/IFactionClient';
import { FACTION_PERMISSION_FLAGS } from '../../shared/flags/FactionPermissionFlags';

const url = `http://127.0.0.1:5500/src/webview/client/factions/index.html`;
let view: View;
let faction: IFactionClient;

class FactionsView implements ViewModel {
    static init() {
        KeybindController.registerKeybind({
            key: KEY_BINDS.FACTIONS,
            singlePress: () => {
                alt.emitServer(View_Events_Factions.Open);
            }
        });
    }

    static async show(_faction: IFactionClient): Promise<void> {
        faction = _faction;

        if (isAnyMenuOpen()) {
            return;
        }

        view = await View.getInstance(url, true, false, true);
        view.on('factions:Ready', FactionsView.ready);
        view.on('factions:GetCurrency', FactionsView.getCurrency);
        view.on(View_Events_Factions.Close, FactionsView.close);
        view.on(View_Events_Factions.Bus, FactionsView.bus);
        alt.toggleGameControls(false);
        BaseHUD.setHudVisibility(false);
    }

    static close() {
        alt.toggleGameControls(true);
        BaseHUD.setHudVisibility(true);
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
}

alt.onServer(SYSTEM_EVENTS.TICKS_START, FactionsView.init);
alt.onServer(View_Events_Factions.Update, FactionsView.update);
alt.onServer(View_Events_Factions.Open, FactionsView.show);
