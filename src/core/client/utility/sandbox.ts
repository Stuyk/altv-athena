import * as alt from 'alt-client';
import { AthenaClient } from '@AthenaClient/api/athena';

function onReady() {
    AthenaClient.webview.emit('do:something...', 'hi');
}

function onClose() {
    // Nothing actually needs to be done.
    // The internal controller handled it all.
}

const page = new AthenaClient.webview.page({
    name: 'MyWebView',
    callbacks: { onReady, onClose },
    options: {
        onOpen: {
            disableControls: true,
            blurBackground: true,
            focus: true,
            hideHud: true,
            hideOverlays: true,
            setIsMenuOpenToTrue: true,
            showCursor: true,
        },
        onClose: {
            enableControls: true,
            hideCursor: true,
            setIsMenuOpenToFalse: true,
            showHud: true,
            showOverlays: true,
            unblurBackground: true,
            unfocus: true,
        },
    },
    keybind: {
        key: 75, // k
        isLongPress: true,
    },
});

alt.onServer('openMyPage', page.open);
alt.onServer('forceCloseMyPage', () => {
    page.close(true);
});
