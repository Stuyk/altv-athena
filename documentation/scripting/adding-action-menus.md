---
description: Learn how to use an Action Menu.
---

# Adding an Action Menu

Actions menu's are a custom menu that makes various event calls either on server-side or client-side.

![](https://i.imgur.com/XKdwj0i.png)

## Benefits

-   Easily Customizable
-   Infinitely Scaleable
-   Used Server or Client Side
-   Can be Dynamically Created
-   1 - 9 Hotkeys
-   Arrow Key Usage
-   Enter Keypress
-   Backspace Keypress

## Usage

This is an example from the `plugins` folder.
This is an over the top menu with multiple menu levels and pointless functionality.

```ts
import * as alt from 'alt-server';
import { playerFuncs } from '../../server/extensions/Player';
import ChatController from '../../server/systems/chat';
import { AnimationFlags } from '../../shared/flags/animation';
import { Permissions } from '../../shared/flags/permissions';
import { Action } from '../../shared/interfaces/Actions';
import { Animation } from '../../shared/interfaces/Animation';

ChatController.addCommand('actionmenu', '/actionmenu - Opens test action menu', Permissions.Admin, handleCommand);

function handleCommand(player: alt.Player): void {
    // Create an action called facePalm that uses the Animation Interface.
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

    // Create an action called gangSign that uses the Animation Interface.
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

    // Create the menu and send it to the player/
    playerFuncs.set.actionMenu(
        player,
        // The Menu
        {
            // Option 1 in the menu is a single event.
            'Option 1': {
                eventName: 'hello:From:Client',
                isServer: true
            },
            // Animations in the menu contains 2 more events. You can also add another menu.
            Animations: {
                'Face Palm': facePalm,
                'Gang Sign': gangSign
                // Creates a menu in the menu.
                'More Animations': {
                    'Face Palm 2': facePalm, // Just using the same one for testing purposes
                    'Gang Sign 2': gangSign
                    // Creates a menu in the menu in the menu
                    'More More Animations': {
                        'Face Palm 3': facePalm, // Just using the same one for testing purposes
                        'Gang Sign 3': gangSign
                        // etc...
                    }
                }
            }
        }
    );
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
```
