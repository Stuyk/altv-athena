import * as alt from 'alt-client';
import * as AthenaClient from '@AthenaClient/api/index.js';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import { Interaction } from '@AthenaShared/interfaces/interaction.js';
import { onTicksStart } from '@AthenaClient/events/onTicksStart.js';

let interaction: Interaction = null;
let interactionTemporary: string = null;

const Internal = {
    init() {
        alt.onServer(SYSTEM_EVENTS.INTERACTION_TEMPORARY, Internal.set.temporary);
        alt.onServer(SYSTEM_EVENTS.PLAYER_SET_INTERACTION, Internal.set.primary);
    },
    set: {
        temporary(eventName: string | null) {
            interactionTemporary = eventName;
        },
        primary(latestInteraction: Interaction) {
            interaction = latestInteraction;
            AthenaClient.systems.entitySelector.setInteraction(latestInteraction);
        },
    },
};

/**
 * Invoke an interaction
 *
 * @return {void}
 */
export function invoke() {
    if (typeof interactionTemporary === 'string') {
        alt.emitServer(interactionTemporary);
        return;
    }

    alt.emitServer(SYSTEM_EVENTS.INTERACTION);
}

/**
 * Check if an interaction is currently available to be invoked
 */
export function isInteractionAvailable() {
    if (typeof interactionTemporary === 'string') {
        return true;
    }

    return typeof interaction !== 'undefined' && interaction !== null;
}

onTicksStart.add(Internal.init);
