import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Action, ActionMenu } from '../../shared/interfaces/actions';
import { WebViewController } from '../extensions/view2';
import ViewModel from '../models/viewModel';

const PAGE_NAME = 'Actions';

let hasRegistered = false;
let isDisabled = false;
let actionMenu: ActionMenu;

class ActionsView implements ViewModel {
    /**
     * The events are bound once to the WebView.
     * They are never bound again.
     * @static
     * @memberof ActionsView
     */
    static async open() {
        const view = await WebViewController.get();

        if (!hasRegistered) {
            hasRegistered = true;
        } else {
            view.off(`${PAGE_NAME}:Ready`, ActionsView.ready);
            view.off(`${PAGE_NAME}:Close`, ActionsView.close);
            view.off(`${PAGE_NAME}:Trigger`, ActionsView.trigger);
        }

        view.on(`${PAGE_NAME}:Ready`, ActionsView.ready);
        view.on(`${PAGE_NAME}:Close`, ActionsView.close);
        view.on(`${PAGE_NAME}:Trigger`, ActionsView.trigger);
        view.focus();
        WebViewController.openPages(PAGE_NAME, false, () => {
            ActionsView.close(true);
        });

        alt.on('keyup', ActionsView.keyUp);
    }

    /**
     * Set the action menu instance.
     * Set to null to force-clear the menu.
     * @static
     * @param {(ActionMenu | null)} actionMenu
     * @return {*}
     * @memberof ActionController
     */
    static set(_actionMenu: ActionMenu) {
        if (!_actionMenu || isDisabled) {
            ActionsView.close();
            return;
        }

        if (alt.Player.local.meta.isDead) {
            return;
        }

        if (alt.Player.local.isChatOpen) {
            return;
        }

        if (alt.Player.local.isMenuOpen) {
            return;
        }

        if (alt.Player.local.isActionMenuOpen) {
            return;
        }

        actionMenu = _actionMenu;
        ActionsView.open();
    }

    static trigger(action: Action) {
        ActionsView.close();

        if (action.isServer) {
            alt.emitServer(action.eventName, action.data);
            return;
        }

        alt.emit(action.eventName, action.data);
    }

    static async ready() {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:Set`, actionMenu);
        alt.Player.local.isActionMenuOpen = true;
    }

    static async close(skipPageClose = false) {
        actionMenu = null;
        const view = await WebViewController.get();

        if (!skipPageClose) {
            WebViewController.closePages([PAGE_NAME]);
        }

        WebViewController.unfocus();
        view.off(`${PAGE_NAME}:Ready`, ActionsView.ready);
        view.off(`${PAGE_NAME}:Close`, ActionsView.close);
        view.off(`${PAGE_NAME}:Trigger`, ActionsView.trigger);
        view.unfocus();
        alt.off('keyup', ActionsView.keyUp);
        alt.Player.local.isActionMenuOpen = false;
    }

    static async keyUp(key: number) {
        const view = await WebViewController.get();
        view.emit(`${PAGE_NAME}:KeyPress`, key);
    }
}

alt.onServer(SYSTEM_EVENTS.SET_ACTION_MENU, ActionsView.set);
