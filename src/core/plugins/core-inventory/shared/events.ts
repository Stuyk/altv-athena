export const INVENTORY_EVENTS = {
    PAGE: 'Inventory2',
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
        SET_EQUIPMENT: 'inventory:event:set:equipment',
        SET_INVENTORY: 'inventory:event:set:inventory',
    },
};
