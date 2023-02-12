import { SYSTEM_EVENTS } from '@AthenaShared/enums/system';
import * as alt from 'alt-server';
import { PlayerEvents } from './playerEvents';

alt.onClient(SYSTEM_EVENTS.INTERACTION_PICKUP_ITEM, (player: alt.Player, _id: string) => {
    if (!player || !player.valid) {
        return;
    }

    PlayerEvents.trigger('pickup-item', player, _id);
});
