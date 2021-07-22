import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';
import { View } from '../extensions/view';
import ViewModel from '../models/ViewModel';
import { fetchToken } from '../systems/quickToken';
import { sleep } from '../utility/sleep';
import { drawRectangle2D, drawText2D } from '../utility/text';
import { Timer } from '../utility/timers';

const url = `http://assets/webview/client/login/index.html`;
let view: View;
let discordURI;
let interval;
let count = 0;
let neededRequests = 0;

export class LoginView implements ViewModel {
    static async open(oAuthUrl: string) {
        discordURI = oAuthUrl;
        view = await View.getInstance(url, true, false, false);
        view.on('discord:OpenURL', LoginView.openURL);
        view.on('discord:FinishAuth', LoginView.finish);
        view.on('discord:Ready', LoginView.ready);
        alt.toggleGameControls(false);

        if (interval !== null && interval !== undefined) {
            native.doScreenFadeOut(0);
            Timer.clearInterval(interval);
            interval = null;
        }

        sleep(25);
        fetchToken();
    }

    static ready() {
        if (!view) {
            return;
        }

        view.emit('discord:SetLocales', LocaleController.getWebviewLocale(LOCALE_KEYS.WEBVIEW_LOGIN));
    }

    static close() {
        alt.toggleGameControls(true);

        if (interval !== null && interval !== undefined) {
            Timer.clearInterval(interval);
            interval = null;
        }

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

    /**
     * Creates a short feedback loop for testing connection before
     * triggering the login screen to the client.
     * @static
     * @memberof LoginView
     */
    static async checkConnection(data: Array<number>) {
        const [_count, _neededRequests] = data;

        if (interval === undefined || interval === undefined) {
            interval = Timer.createInterval(LoginView.render, 0, 'Login.ts - Connection Check');
        }

        count = _count;
        neededRequests = _neededRequests;

        await sleep(25);
        alt.emitServer(SYSTEM_EVENTS.CHECK_CONNECTION);
    }

    static render() {
        drawRectangle2D({ x: 0.5, y: 0.5 }, { x: 1, y: 1 }, new alt.RGBA(0, 0, 0, 255));
        drawText2D(`Testing Connection`, { x: 0.5, y: 0.75 }, 0.6, new alt.RGBA(255, 255, 255, 255), 0);

        if (!neededRequests) {
            return;
        }

        drawText2D(
            `${((count / neededRequests) * 100).toFixed(0)}%`,
            { x: 0.5, y: 0.8 },
            0.6,
            new alt.RGBA(255, 255, 255, 255),
            0
        );

        drawText2D(
            `If this takes longer than 5s there's a problem with your connection...`,
            { x: 0.5, y: 0.85 },
            0.55,
            new alt.RGBA(255, 255, 255, 255),
            0
        );
    }
}

alt.onServer(`Discord:Open`, LoginView.open);
alt.onServer(`Discord:Close`, LoginView.close);
alt.onServer('Discord:Fail', LoginView.emitFailureMessage);
alt.onServer(SYSTEM_EVENTS.CHECK_CONNECTION, LoginView.checkConnection);
