import * as alt from 'alt-client';
import { InputMenu, InputResult } from '../../shared/interfaces/InputMenus';
import ViewModel from '../models/ViewModel';
import { isAnyMenuOpen } from '../utility/menus';
import { View_Events_Input_Menu } from '../../shared/enums/Views';
import { WebViewController } from '../extensions/view2';

const PAGE_NAME = 'InputBox';
let inputMenu: InputMenu;

export class InputView implements ViewModel {
    static async show(_inputMenu: InputMenu): Promise<void> {
        inputMenu = _inputMenu;

        if (isAnyMenuOpen()) {
            return;
        }

        // Must always be called first if you want to hide HUD.
        await WebViewController.setOverlaysVisible(false);

        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:Ready`, InputView.ready);
        view.on(`${PAGE_NAME}:Submit`, InputView.submit);
        view.on(`${PAGE_NAME}:Close`, InputView.close);

        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);

        alt.toggleGameControls(false);

        alt.Player.local.isMenuOpen = true;
    }

    static async close(isNotCancel = false) {
        alt.toggleGameControls(true);

        WebViewController.setOverlaysVisible(true);

        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:Ready`, InputView.ready);
        view.off(`${PAGE_NAME}:Submit`, InputView.submit);
        view.off(`${PAGE_NAME}:Close`, InputView.close);

        WebViewController.closePages([PAGE_NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.Player.local.isMenuOpen = false;

        if (isNotCancel) {
            return;
        }

        if (inputMenu.callback) {
            inputMenu.callback(null);
        }

        if (inputMenu.serverEvent) {
            alt.emitServer(inputMenu.serverEvent, null);
        }
    }

    static submit(results: InputResult[]) {
        if (inputMenu.callback) {
            inputMenu.callback(results);
        }

        if (inputMenu.serverEvent) {
            alt.emitServer(inputMenu.serverEvent, results);
        }

        InputView.close(true);
    }

    static async ready() {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:SetMenu`, inputMenu.title, inputMenu.options, inputMenu.generalOptions);
    }
}

alt.onServer(View_Events_Input_Menu.SetMenu, InputView.show);
