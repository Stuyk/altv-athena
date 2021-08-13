import * as alt from 'alt-client';
import { InputMenu, InputResult } from '../../shared/interfaces/InputMenus';
import { View } from '../extensions/view';
import ViewModel from '../models/ViewModel';
import { isAnyMenuOpen } from '../utility/menus';
import { BaseHUD } from './hud/hud';
import { View_Events_Input_Menu } from '../../shared/enums/views';

const url = `http://assets/webview/client/input/index.html`;
let inputMenu: InputMenu;
let view: View;

export class InputView implements ViewModel {
    static async show(_inputMenu: InputMenu): Promise<void> {
        inputMenu = _inputMenu;

        if (isAnyMenuOpen()) {
            return;
        }

        view = await View.getInstance(url, true, false, true);
        view.on('input:Ready', InputView.ready);
        view.on('input:Submit', InputView.submit);
        view.on('input:Close', InputView.close);
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
        inputMenu = null;
    }

    static submit(results: InputResult[]) {
        if (inputMenu.callback) {
            inputMenu.callback(results);
        }

        if (inputMenu.serverEvent) {
            alt.emitServer(inputMenu.serverEvent, results);
        }

        InputView.close();
    }

    static ready() {
        view.emit('input:SetMenu', inputMenu.title, inputMenu.options);
    }
}

alt.onServer(View_Events_Input_Menu.SetMenu, InputView.show);
