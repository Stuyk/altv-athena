import * as alt from 'alt-client';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { View } from '../extensions/view';
import ViewModel from '../models/ViewModel';

const url = `http://assets/webview/client/login/index.html`;
let view: View;
let discordURI;

export class LoginView implements ViewModel {
    static async open(oAuthUrl: string) {
        discordURI = oAuthUrl;
        view = await View.getInstance(url, true, false, false);
        view.on('discord:OpenURL', LoginView.openURL);
        view.on('discord:FinishAuth', LoginView.finish);
        view.on('discord:Ready', LoginView.ready);
        alt.toggleGameControls(false);
    }

    static ready() {
        if (!view) {
            return;
        }

        view.emit('discord:SetLocales', LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_LOGIN));
    }

    static close() {
        alt.toggleGameControls(true);

        if (!view) {
            return;
        }

        view.close();
        view = null;
    }

    static openURL() {
        if (!view) {
            return;
        }

        view.emit('discord:OpenURL', discordURI, true);
    }

    static finish() {
        alt.emitServer('discord:FinishAuth');
    }

    static emitFailureMessage(message: string) {
        if (!view) {
            return;
        }

        view.emit('discord:Fail', message);
    }

    static trigger() {
        alt.emitServer('discord:Begin');
    }
}

alt.on('connectionComplete', LoginView.trigger);
alt.onServer(`Discord:Open`, LoginView.open);
alt.onServer(`Discord:Close`, LoginView.close);
alt.onServer('Discord:Fail', LoginView.emitFailureMessage);
