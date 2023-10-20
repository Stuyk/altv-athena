import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '@AthenaShared/enums/system.js';
import * as PlayerEvents from '../player/events.js';

alt.onClient(SYSTEM_EVENTS.INTERACTION_PICKUP_ITEM, (player: alt.Player, _id: string) => {
    if (!player || !player.valid) {
        return;
    }

    PlayerEvents.trigger('pickup-item', player, _id);
});
