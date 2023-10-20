import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api/index.js';
import { AuthEvents } from '../shared/events.js';

let page: AthenaClient.webview.Page;

function requestLogin() {
    page = new AthenaClient.webview.Page({
        name: 'BasicAuth',
        callbacks: { onClose() {}, onReady() {} },
        options: {
            disableEscapeKey: true,
            onClose: {
                enableControls: true,
                hideCursor: true,
                enablePauseMenu: true,
                setIsMenuOpenToFalse: true,
                showHud: true,
                showOverlays: true,
                unblurBackground: true,
                unfocus: true,
            },
            onOpen: {
                blurBackground: true,
                disableControls: 'all',
                disablePauseMenu: true,
                focus: true,
                hideHud: true,
                hideOverlays: true,
                setIsMenuOpenToTrue: true,
                showCursor: true,
                forceOpen: true,
            },
        },
    });

    page.open();
}

function endLogin() {
    page.close(true);
}

alt.onServer(AuthEvents.toClient.requestLogin, requestLogin);
alt.onServer(AuthEvents.toClient.endLogin, endLogin);

AthenaClient.webview.on(AuthEvents.toClient.fromWebview.quit, () => {
    console.log(`Quitting Game!`);
    native.quitGame();
});
