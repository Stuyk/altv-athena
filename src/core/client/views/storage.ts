import * as alt from 'alt-client';
import { View_Events_Storage } from '../../shared/enums/Views';
import { Item } from '../../shared/interfaces/Item';
import { View } from '../extensions/view';
import ViewModel from '../models/ViewModel';
import { isAnyMenuOpen } from '../utility/menus';
import { BaseHUD } from './hud/hud';

const url = `http://assets/webview/client/storage/index.html`;
let view: View;
let name: string;
let id: string;
let storage: Item[];
let inventory: Array<Array<Item>>;

class StorageView implements ViewModel {
    static async show(_id: string, _name: string, _storage: Item[], _inventory: Array<Array<Item>>): Promise<void> {
        id = _id;
        name = _name;
        storage = _storage;
        inventory = _inventory;

        if (isAnyMenuOpen()) {
            return;
        }

        view = await View.getInstance(url, true, false, true);
        view.on('storage:Ready', StorageView.refresh);
        view.on('storage:Close', StorageView.close);
        view.on('storage:MoveFromPlayer', StorageView.moveFromPlayer);
        view.on('storage:MoveFromStorage', StorageView.moveFromStorage);
        alt.toggleGameControls(false);
        BaseHUD.setHudVisibility(false);
    }

    static close() {
        alt.toggleGameControls(true);
        BaseHUD.setHudVisibility(true);
        alt.emitServer(View_Events_Storage.Close);

        id = null;
        name = null;
        storage = null;
        inventory = null;

        if (!view) {
            return;
        }

        view.close();
        view = null;
    }

    static refresh(_inventory: Array<Array<Item>>, _storage: Item[]) {
        if (_storage) {
            storage = _storage;
        }

        if (_inventory) {
            inventory = _inventory;
        }

        if (!view) {
            return;
        }

        view.emit('storage:SetName', name);
        view.emit('storage:SetStorage', storage);
        view.emit('storage:SetInventory', inventory);
    }

    static moveFromStorage(index: number) {
        alt.emitServer(View_Events_Storage.MoveFromStorage, id, index);
    }

    static moveFromPlayer(tab: number, index: number) {
        alt.emitServer(View_Events_Storage.MoveFromPlayer, id, tab, index);
    }
}

alt.onServer(View_Events_Storage.Open, StorageView.show);
alt.onServer(View_Events_Storage.Close, StorageView.close);
alt.onServer(View_Events_Storage.Refresh, StorageView.refresh);
