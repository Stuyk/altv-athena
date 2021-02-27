import * as alt from 'alt-server';
import { playerFuncs } from 'core/server/extensions/Player';
import ChatController from 'core/server/systems/chat';
import { AnimationFlags } from 'core/shared/flags/animation';
import { Permissions } from 'core/shared/flags/permissions';
import { Action } from 'core/shared/interfaces/Actions';
import { Animation } from 'core/shared/interfaces/Animation';

ChatController.addCommand('actionmenu', '/actionmenu - Opens test action menu', Permissions.Admin, handleCommand);

function handleCommand(player: alt.Player): void {
    const facePalm: Action<Animation> = {
        eventName: 'animation:Action:Server',
        isServer: true,
        data: {
            dict: 'anim@mp_player_intupperface_palm',
            name: 'idle_a',
            duration: 3000,
            flags: AnimationFlags.UPPERBODY_ONLY
        }
    };

    const gangSign: Action<Animation> = {
        eventName: 'animation:Action:Server',
        isServer: true,
        data: {
            dict: 'mp_player_int_uppergang_sign_a',
            name: 'mp_player_int_gang_sign_a',
            duration: 3000,
            flags: AnimationFlags.UPPERBODY_ONLY
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
