import * as alt from 'alt-client';
import { LOCALE_KEYS } from '../../../shared/locale/languages/keys';
import { LocaleController } from '../../../shared/locale/locale';
import { View } from '../../extensions/view';

// const url = `http://127.0.0.1:5555/src/core/client/views/login/html/index.html`;
const url = `http://resource/client/views/login/html/index.html`;
let view: View;
let discordURI;

export class LoginController {
    static async show(oAuthUrl: string) {
        discordURI = oAuthUrl;
        view = await View.getInstance(url, true, false, false);
        view.on('discord:OpenURL', LoginController.open);
        view.on('discord:FinishAuth', LoginController.finish);
        view.on('discord:Ready', LoginController.handleReady);
        alt.toggleGameControls(false);
    }

    static handleReady() {
        if (!view) {
            return;
        }

        view.emit('discord:SetLocales', LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_LOGIN));
    }

    static open() {
        if (!view) {
            return;
        }

        view.emit('discord:OpenURL', discordURI, true);
    }

    static close() {
        alt.toggleGameControls(true);

        if (view) {
            view.close();
        }
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

alt.on('connectionComplete', LoginController.trigger);
alt.onServer(`Discord:Open`, LoginController.show);
alt.onServer(`Discord:Close`, LoginController.close);
alt.onServer('Discord:Fail', LoginController.emitFailureMessage);
