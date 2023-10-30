import * as alt from 'alt-shared';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api/index.js';
import { Page } from '@AthenaClient/webview/page.js';
import { MAIN_CHARACTER_CREATOR_EVENTS } from '../shared/events.js';

let page: Page;

export function open(onReady: Function, onClose: Function) {
    if (!page) {
        page = new AthenaClient.webview.Page({
            name: 'CharacterCreatorMain',
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
                    forceOpen: true,
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

        AthenaClient.webview.on(MAIN_CHARACTER_CREATOR_EVENTS.GET_OVERLAY_COUNT, getOverlays);
        AthenaClient.webview.on(MAIN_CHARACTER_CREATOR_EVENTS.GET_PRIMARY_COLOR_LIST, getPrimaryColorList);
        AthenaClient.webview.on(MAIN_CHARACTER_CREATOR_EVENTS.GET_SECONDARY_COLOR_LIST, getSecondaryColorList);
    }

    page.open();
}

export function close() {
    page.close();
}

export function getPage(): Page {
    return page;
}

function getOverlays(id: number) {
    const overlayCount = native.getPedHeadOverlayNum(id);
    AthenaClient.webview.emit(MAIN_CHARACTER_CREATOR_EVENTS.GET_OVERLAY_COUNT, id, overlayCount);
}

function getPrimaryColorList() {
    const colors: alt.RGBA[] = [];

    const hairColorCount = native.getNumPedHairTints();
    for (let i = 0; i < hairColorCount; i++) {
        const [_, r, g, b] = native.getPedHairTintColor(i);
        colors.push(new alt.RGBA(r, g, b));
    }

    AthenaClient.webview.emit(MAIN_CHARACTER_CREATOR_EVENTS.GET_PRIMARY_COLOR_LIST, colors);
}

function getSecondaryColorList() {
    const colors: alt.RGBA[] = [];

    const tintCount = native.getNumPedMakeupTints();
    for (let i = 0; i < tintCount; i++) {
        const [_, r, g, b] = native.getPedMakeupTintColor(i);
        colors.push(new alt.RGBA(r, g, b));
    }

    AthenaClient.webview.emit(MAIN_CHARACTER_CREATOR_EVENTS.GET_SECONDARY_COLOR_LIST, colors);
}
