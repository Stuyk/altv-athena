import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/System';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { WebViewController } from '../extensions/view2';
import ViewModel from '../models/ViewModel';
import { fetchToken } from '../systems/quickToken';
import { sleep } from '../utility/sleep';

const PAGE_NAME = 'Login';

let discordURI: string;

export class LoginView implements ViewModel {
    static async open(oAuthUrl: string) {
        discordURI = oAuthUrl;
        alt.toggleGameControls(false);
        fetchToken();
    }

    static async finishOpen() {
        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:OpenURL`, LoginView.openURL);
        view.on(`${PAGE_NAME}:FinishAuth`, LoginView.finish);
        view.on(`${PAGE_NAME}:Ready`, LoginView.ready);

        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);
    }

    static async ready() {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:SetLocales`, LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_LOGIN));
    }

    static async close() {
        alt.toggleGameControls(true);

        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:OpenURL`, LoginView.openURL);
        view.off(`${PAGE_NAME}:FinishAuth`, LoginView.finish);
        view.off(`${PAGE_NAME}:Ready`, LoginView.ready);

        WebViewController.closePages([PAGE_NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);
    }

    static async openURL() {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:OpenURL`, discordURI, true);
    }

    static finish() {
        alt.emitServer(SYSTEM_EVENTS.DISCORD_FINISH_AUTH);
    }

    static async emitFailureMessage(message: string) {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:Fail`, message);
    }
}

alt.onServer(SYSTEM_EVENTS.QUICK_TOKEN_NONE_BUT_DO_LOGIN, LoginView.finishOpen);
alt.onServer(SYSTEM_EVENTS.DISCORD_OPEN, LoginView.open);
alt.onServer(SYSTEM_EVENTS.DISCORD_CLOSE, LoginView.close);
alt.onServer(SYSTEM_EVENTS.DISCORD_FAIL, LoginView.emitFailureMessage);
