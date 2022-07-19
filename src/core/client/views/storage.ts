import * as alt from 'alt-client';
import { View_Events_Storage } from '../../shared/enums/views';
import { Item } from '../../shared/interfaces/item';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { WebViewController } from '../extensions/view2';
import ViewModel from '../models/viewModel';
import { isAnyMenuOpen } from '../utility/menus';

const PAGE_NAME = 'Storage';

let name: string;
let id: string;
let storage: Item[];
let inventory: Array<Array<Item>>;

class InternalFunctions implements ViewModel {
    static async show(_id: string, _name: string, _storage: Item[], _inventory: Array<Array<Item>>): Promise<void> {
        id = _id;
        name = _name;
        storage = _storage;
        inventory = _inventory;

        if (isAnyMenuOpen()) {
            return;
        }

        // Must always be called first if you want to hide HUD.
        await WebViewController.setOverlaysVisible(false);

        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Ready`, InternalFunctions.refresh);
        view.on(`${PAGE_NAME}:Close`, InternalFunctions.close);
        view.on(`${PAGE_NAME}:MoveFromPlayer`, InternalFunctions.moveFromPlayer);
        view.on(`${PAGE_NAME}:MoveFromStorage`, InternalFunctions.moveFromStorage);
        WebViewController.openPages(PAGE_NAME, true, InternalFunctions.close);
        WebViewController.focus();
        WebViewController.showCursor(true);
        alt.toggleGameControls(false);
        alt.Player.local.isMenuOpen = true;
    }

    static async close() {
        alt.toggleGameControls(true);
        WebViewController.setOverlaysVisible(true);
        alt.emitServer(View_Events_Storage.Close);

        id = null;
        name = null;
        storage = null;
        inventory = null;

        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Ready`, InternalFunctions.refresh);
        view.off(`${PAGE_NAME}:Close`, InternalFunctions.close);
        view.off(`${PAGE_NAME}:MoveFromPlayer`, InternalFunctions.moveFromPlayer);
        view.off(`${PAGE_NAME}:MoveFromStorage`, InternalFunctions.moveFromStorage);

        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;
    }

    static async refresh(_inventory: Array<Array<Item>>, _storage: Item[]) {
        if (_storage) {
            storage = _storage;
        }

        if (_inventory) {
            inventory = _inventory;
        }

        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:SetName`, name);
        view.emit(`${PAGE_NAME}:SetStorage`, storage);
        view.emit(`${PAGE_NAME}:SetInventory`, inventory);
        view.emit(`${PAGE_NAME}:SetLocale`, LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_STORAGE));
    }

    static moveFromStorage(index: number, amount: number) {
        alt.emitServer(View_Events_Storage.MoveFromStorage, id, index, amount);
    }

    static moveFromPlayer(index: number, amount: number) {
        alt.emitServer(View_Events_Storage.MoveFromPlayer, id, index, amount);
    }
}

alt.onServer(View_Events_Storage.Open, InternalFunctions.show);
alt.onServer(View_Events_Storage.Close, InternalFunctions.close);
alt.onServer(View_Events_Storage.Refresh, InternalFunctions.refresh);
