import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { WebViewController } from '../extensions/view2';
import ViewModel from '../models/viewModel';
import { fetchToken } from '../systems/quickToken';

const PAGE_NAME = 'Login';

let discordURI: string;

/**
 * Do Not Export Internal Only
 */
class InternalFunctions implements ViewModel {
    static async open(oAuthUrl: string) {
        discordURI = oAuthUrl;
        alt.toggleGameControls(false);
        fetchToken();
    }

    static async finishOpen() {
        const view = await WebViewController.get();
        view.on(`${PAGE_NAME}:OpenURL`, InternalFunctions.openURL);
        view.on(`${PAGE_NAME}:FinishAuth`, InternalFunctions.finish);
        view.on(`${PAGE_NAME}:Ready`, InternalFunctions.ready);

        WebViewController.openPages([PAGE_NAME]);
        WebViewController.focus();
        WebViewController.showCursor(true);
    }

    static async ready() {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:SetLocales`, LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_LOGIN));
    }

    static async close() {
        const view = await WebViewController.get();
        view.off(`${PAGE_NAME}:OpenURL`, InternalFunctions.openURL);
        view.off(`${PAGE_NAME}:FinishAuth`, InternalFunctions.finish);
        view.off(`${PAGE_NAME}:Ready`, InternalFunctions.ready);

        WebViewController.closePages([PAGE_NAME]);
        WebViewController.unfocus();
        WebViewController.showCursor(false);

        alt.toggleGameControls(true);
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

alt.onServer(SYSTEM_EVENTS.QUICK_TOKEN_NONE_BUT_DO_LOGIN, InternalFunctions.finishOpen);
alt.onServer(SYSTEM_EVENTS.DISCORD_OPEN, InternalFunctions.open);
alt.onServer(SYSTEM_EVENTS.DISCORD_CLOSE, InternalFunctions.close);
alt.onServer(SYSTEM_EVENTS.DISCORD_FAIL, InternalFunctions.emitFailureMessage);
