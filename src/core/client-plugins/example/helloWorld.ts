import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';

// This will only turn on your plugin when they've fully logged in.
alt.onServer(SYSTEM_EVENTS.TICKS_START, whatToDoAfterLogin);

// Gets called when the player logs in and spawns.
function whatToDoAfterLogin() {
    alt.log('Loaded Test Plugin: Example');

    // Do other things...
    // Call other functions...
}
