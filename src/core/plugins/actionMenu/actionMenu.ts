import * as alt from 'alt-server';
import { playerFuncs } from '../../server/extensions/Player';
import ChatController from '../../server/systems/chat';
import { ANIMATION_FLAGS } from '../../shared/flags/AnimationFlags';
import { PERMISSIONS } from '../../shared/flags/PermissionFlags';
import { Action } from '../../shared/interfaces/Actions';
import { Animation } from '../../shared/interfaces/Animation';
import { LOCALE_KEYS } from '../../shared/locale/languages/keys';
import { LocaleController } from '../../shared/locale/locale';

ChatController.addCommand(
    'actionmenu',
    LocaleController.get(LOCALE_KEYS.COMMAND_ACTION_MENU, '/actionmenu'),
    PERMISSIONS.ADMIN,
    handleCommand
);

function handleCommand(player: alt.Player): void {
    const facePalm: Action = {
        eventName: 'animation:Action:Server',
        isServer: true,
        data: {
            dict: 'anim@mp_player_intupperface_palm',
            name: 'idle_a',
            duration: 3000,
            flags: ANIMATION_FLAGS.UPPERBODY_ONLY
        }
    };

    const gangSign: Action = {
        eventName: 'animation:Action:Server',
        isServer: true,
        data: {
            dict: 'mp_player_int_uppergang_sign_a',
            name: 'mp_player_int_gang_sign_a',
            duration: 3000,
            flags: ANIMATION_FLAGS.UPPERBODY_ONLY
        }
    };

    playerFuncs.set.actionMenu(player, {
        'Option 1': {
            eventName: 'hello:From:Client',
            isServer: true
        },
        Animations: {
            'Face Palm': facePalm,
            'Gang Sign': gangSign
        }
    });
}

alt.onClient('hello:From:Client', (player) => {
    playerFuncs.emit.message(player, `Got menu option from client.`);
});

alt.onClient('animation:Action:Server', (player, data: Animation) => {
    if (!data) {
        return;
    }

    playerFuncs.emit.animation(player, data.dict, data.name, data.flags, data.duration);
});
