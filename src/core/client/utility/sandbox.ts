import * as native from 'natives';
import * as alt from 'alt-client';
import { playAnimation } from '../systems/animations';
import { ANIMATION_FLAGS } from '../../shared/flags/animationFlags';

import { isAnyMenuOpen } from './menus';
import { AthenaClient } from '../api/athena';

const SEMI_COLON = 186; // ;

async function doSomething() {
    // Prevents chat from triggering this key press.
    if (isAnyMenuOpen(false)) {
        return;
    }

    await playAnimation('amb@code_human_in_car_mp_actions@dance@std@rds@base', 'idle_a', ANIMATION_FLAGS.REPEAT);
}

AthenaClient.events.keyBinds.registerKeybind({
    key: SEMI_COLON,
    singlePress: doSomething,
})