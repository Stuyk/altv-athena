import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api';
import { Page } from '@AthenaClient/webview/page';

let page: Page;

export function open(onReady: Function, onClose: Function) {
    if (!page) {
        page = new AthenaClient.webview.Page({
            name: 'CharSelect',
            callbacks: {
                onReady,
                onClose,
            },
            options: {
                disableEscapeKey: true,
                onOpen: {
                    disableControls: 'all',
                    disablePauseMenu: true,
                    focus: true,
                    showCursor: true,
                    setIsMenuOpenToTrue: true,
                    hideOverlays: true,
                    hideHud: true,
                },
                onClose: {
                    enableControls: true,
                    enablePauseMenu: true,
                    hideCursor: true,
                    setIsMenuOpenToFalse: true,
                    showHud: true,
                    showOverlays: true,
                    unfocus: true,
                },
            },
        });
    }

    page.open();
}

export function close() {
    page.close();
}

export function getPage(): Page {
    return page;
}
