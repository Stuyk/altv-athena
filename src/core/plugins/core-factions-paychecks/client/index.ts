import * as alt from 'alt-client';
import { FactionView } from '../../core-factions/client/views/factionView';
import { Faction } from '../../core-factions/shared/interfaces';
import { F_PAYCHECK_EVENTS, F_PAYCHECK_VIEW_EVENTS } from '../shared/events';

let _view: alt.WebView;

class InternalFunctions {
    static init() {
        FactionView.onOpen(InternalFunctions.open);
        FactionView.onClose(InternalFunctions.close);
        alt.onServer(F_PAYCHECK_EVENTS.GET_PAYCHECK_TIME_LEFT, InternalFunctions.setPaycheckTimeLeft);
    }

    /**
     * It opens a webview and sets the event listener for the webview to the function
     * `InternalFunctions.requestTime`
     * @param view - alt.WebView - The webview that the event is being called from.
     * @param {Faction} faction - Faction - The faction that the player is in.
     */
    static open(view: alt.WebView, faction: Faction) {
        _view = view;
        view.on(F_PAYCHECK_VIEW_EVENTS.REQUEST_TIME, InternalFunctions.requestTime);
        view.on(F_PAYCHECK_VIEW_EVENTS.CLAIM, InternalFunctions.claim);
        view.on(F_PAYCHECK_VIEW_EVENTS.SET_RANK_PAYCHECK, InternalFunctions.setRankPaycheck);
        view.on(F_PAYCHECK_VIEW_EVENTS.SET_TIME, InternalFunctions.setTime);
    }

    /**
     * It's a static function that closes a webview and removes an event listener.
     * @param view - alt.WebView - The webview that is being closed.
     * @param {Faction} faction - Faction - The faction that the player is in.
     */
    static close(view: alt.WebView, faction: Faction) {
        _view = null;
        view.off(F_PAYCHECK_VIEW_EVENTS.REQUEST_TIME, InternalFunctions.requestTime);
        view.off(F_PAYCHECK_VIEW_EVENTS.CLAIM, InternalFunctions.claim);
        view.off(F_PAYCHECK_VIEW_EVENTS.SET_RANK_PAYCHECK, InternalFunctions.setRankPaycheck);
        view.off(F_PAYCHECK_VIEW_EVENTS.SET_TIME, InternalFunctions.setTime);
    }

    static claim() {
        if (!_view) {
            return;
        }

        alt.emitServer(F_PAYCHECK_EVENTS.CLAIM);
    }

    static setPaycheckTimeLeft(value: number) {
        if (!_view) {
            return;
        }

        _view.emit(F_PAYCHECK_VIEW_EVENTS.SET_TIME, value);
    }

    static setTime(value: number) {
        console.log(value);
        alt.emitServer(F_PAYCHECK_EVENTS.SET_PAYCHECK_TIME, value);
    }

    static setRankPaycheck(uid: string, value: number) {
        console.log(uid, value);
        alt.emitServer(F_PAYCHECK_EVENTS.SET_RANK_PAYCHECK, uid, value);
    }

    static requestTime() {
        alt.emitServer(F_PAYCHECK_EVENTS.GET_PAYCHECK_TIME_LEFT);
    }
}

InternalFunctions.init();
