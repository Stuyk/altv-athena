import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../../../shared/enums/system';
import { Action, ActionMenu } from '../../../../shared/interfaces/Actions';
import { handleFrontendSound } from '../../../systems/sound';
import { BaseHUD } from '../hud';

export class ActionsController {
    /**
     * Set the action menu instance.
     * Set to null to force-clear the menu.
     * @static
     * @param {(ActionMenu | null)} actionMenu
     * @return {*}
     * @memberof ActionController
     */
    static set(actionMenu: ActionMenu) {
        if (!actionMenu) {
            BaseHUD.view.emit('actions:Set', null);
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

        alt.Player.local.isActionMenuOpen = true;
        BaseHUD.view.emit('actions:Set', actionMenu);
    }

    /**
     * Plays a sound when you navigate up and down.
     * @static
     * @memberof ActionController
     */
    static navigate() {
        handleFrontendSound('NAV_UP_DOWN', 'HUD_FREEMODE_SOUNDSET');
    }

    /**
     * Plays a sound when you navigate left to right.
     * @static
     * @memberof ActionsController
     */
    static leftRight() {
        handleFrontendSound('NAV_LEFT_RIGHT', 'HUD_FREEMODE_SOUNDSET');
    }

    /**
     * When the menu is closed or an option is slected.
     * @static
     * @memberof ActionController
     */
    static closed() {
        alt.Player.local.isActionMenuOpen = false;
    }

    /**
     * Triggers the action selected by the user.
     * @static
     * @param {Action} action
     * @return {*}
     * @memberof ActionsController
     */
    static trigger(action: Action) {
        ActionsController.closed();
        handleFrontendSound('SELECT', 'HUD_FREEMODE_SOUNDSET');

        if (action.isServer) {
            alt.emitServer(action.eventName, action.data);
            return;
        }

        alt.emit(action.eventName, action.data);
    }
}

alt.onServer(SYSTEM_EVENTS.SET_ACTION_MENU, ActionsController.set);
