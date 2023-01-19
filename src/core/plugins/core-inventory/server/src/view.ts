import { INVENTORY_EVENTS } from '@AthenaPlugins/core-inventory/shared/events';
import { Athena } from '@AthenaServer/api/athena';
import { ATHENA_EVENTS_PLAYER } from '@AthenaShared/enums/athenaEvents';
import { PLAYER_LOCAL_META } from '@AthenaShared/enums/playerSynced';
import { StoredItem } from '@AthenaShared/interfaces/item';
import * as alt from 'alt-server';

const Internal = {
    use() {
        //
    },
    drop() {
        //
    },
    split() {
        //
    },
    swap() {
        //
    },
    give() {
        //
    },
   
};

export const InventoryView = {
    init() {
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.USE, Internal.use);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.DROP, Internal.drop);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.SPLIT, Internal.split);
        alt.onClient(INVENTORY_EVENTS.TO_SERVER.SWAP, Internal.swap);
    },
};
