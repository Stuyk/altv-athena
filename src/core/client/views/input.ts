import * as alt from 'alt-client';
import { View } from '../extensions/view';
import ViewModel from '../models/ViewModel';
import { isAnyMenuOpen } from '../utility/menus';
import { BaseHUD } from './hud/hud';

const url = `http://assets/webview/client/input/index.html`;
let inputMenu: InputMenu;
let view: View;

export enum InputOptionType {
    TEXT = 'text',
    NUMBER = 'number'
}

export interface InputOption {
    id: string;
    desc: string;
    type: InputOptionType;
    placeholder: string;
    error?: string;
    regex?: string;
}

export interface InputResult {
    id: string;
    value: string | null;
}

export interface InputMenu {
    title: string;
    options: InputOption[];
    callback: (results: InputResult[]) => void;
}

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
        inputMenu.callback(results);
        InputView.close();
    }

    static ready() {
        view.emit('input:SetMenu', inputMenu.title, inputMenu.options);
    }
}
