import * as alt from 'alt-client';

import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import { Interaction } from '@AthenaShared/interfaces/interaction';
import { onTicksStart } from '@AthenaClient/events/onTicksStart';
import { EntitySelector } from './entitySelector';

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
            EntitySelector.set.interaction(latestInteraction);
        },
    },
};

export const ClientInteraction = {
    /**
     * Invoke an interaction
     *
     * @return {*}
     */
    invoke() {
        if (typeof interactionTemporary === 'string') {
            alt.emitServer(interactionTemporary);
            return;
        }

        alt.emitServer(SYSTEM_EVENTS.INTERACTION);
    },
    /**
     * Check if an interaction is currently available to be invoked
     */
    isInteractionAvailable() {
        if (typeof interactionTemporary === 'string') {
            return true;
        }

        return typeof interaction !== 'undefined' && interaction !== null;
    },
};

onTicksStart.add(Internal.init);
