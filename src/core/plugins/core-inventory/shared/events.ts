export const INVENTORY_EVENTS = {
    TO_SERVER: {
        USE: 'inventory:event:server:use',
        DROP: 'inventory:event:server:drop',
        SPLIT: 'inventory:event:server:split',
        SWAP: 'inventory:event:server:swap',
        UNEQUIP: 'inventory:event:server:unequip',
        OPEN: 'inventory:event:server:open',
        CLOSE: 'inventory:event:client:close',
    },
    TO_CLIENT: {
        OPEN: 'inventory:event:client:open',
        CLOSE: 'inventory:event:client:close',
    },
};
