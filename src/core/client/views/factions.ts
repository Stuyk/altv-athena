import * as alt from 'alt-client';
import { KEY_BINDS } from '../../shared/enums/keybinds';
import { View_Events_Factions } from '../../shared/enums/views';
import { IFaction } from '../../shared/interfaces/IFaction';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { KeybindController } from '../events/keyup';
import { View } from '../extensions/view';
import ViewModel from '../models/ViewModel';
import { isAnyMenuOpen } from '../utility/menus';
import { BaseHUD } from './hud/hud';
import { SYSTEM_EVENTS } from '../../shared/enums/system';

const url = `http://127.0.0.1:5500/src/webview/client/factions/index.html`;
let view: View;
let faction: IFaction;

class FactionsView implements ViewModel {
    static init() {
        KeybindController.registerKeybind({
            key: KEY_BINDS.FACTIONS,
            singlePress: () => {
                alt.emitServer(View_Events_Factions.Open);
            }
        });
    }

    static async show(_faction: IFaction): Promise<void> {
        console.log(JSON.stringify(_faction));
        faction = _faction;

        if (isAnyMenuOpen()) {
            return;
        }

        view = await View.getInstance(url, true, false, true);
        view.on('factions:Ready', FactionsView.ready);
        view.on('factions:Close', FactionsView.close);
        view.on('factions:Bus', FactionsView.bus);
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

    static update(_faction: IFaction = null) {
        if (_faction) {
            faction = _faction;
        }

        if (!view) {
            return;
        }

        view.emit('factions:SetFaction', faction);
    }

    static ready() {
        console.log(faction);
        view.emit('factions:SetLocale', null);
        view.emit('factions:SetFaction', faction);
    }

    static bus(eventName: View_Events_Factions, ...args: any[]) {
        alt.emitServer(View_Events_Factions.Bus, eventName, ...args);
    }
}

alt.onServer(SYSTEM_EVENTS.TICKS_START, FactionsView.init);
alt.onServer(View_Events_Factions.Update, FactionsView.update);
alt.onServer(View_Events_Factions.Open, FactionsView.show);
