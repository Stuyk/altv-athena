export const INVENTORY_EVENTS = {
    PAGE: 'Inventory',
    TO_SERVER: {
        USE: 'inventory:event:server:use',
        DROP: 'inventory:event:server:drop',
        SPLIT: 'inventory:event:server:split',
        SWAP: 'inventory:event:server:swap',
        UNEQUIP: 'inventory:event:server:unequip',
        OPEN: 'inventory:event:server:open',
        CLOSE: 'inventory:event:client:close',
        COMBINE: 'inventory:event:server:combine',
    },
    TO_CLIENT: {
        OPEN: 'inventory:event:client:open',
        CLOSE: 'inventory:event:client:close',
    },
    FROM_WEBVIEW: {
        READY: 'inventory:event:ready',
    },
    TO_WEBVIEW: {
        SET_INVENTORY: 'inventory:event:set:inventory',
        SET_SIZE: 'inventory:event:set:size',
        SET_WEIGHT_STATE: 'inventory:event:set:weight:state',
        SET_MAX_WEIGHT: 'inventory:event:set:max:weight',
    },
};
