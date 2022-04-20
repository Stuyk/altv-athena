import * as alt from 'alt-server';
let seats = [];
alt.onClient('altv-sit:server:sit', (player, coords) => seats.push(coords.toString()));
alt.onClient('altv-sit:server:cancel', (player, coords) => {
    for (let i in seats)
        seats[i] === coords.toString() && delete seats[i];
});
alt.onClient('altv-sit:server:trySit', (player, coords) => {
    if (seats.length === 0)
        return alt.emitClient(player, 'altv-sit:client:callback', false);
    for (let i in seats)
        seats[i] !== coords.toString() ? alt.emitClient(player, 'altv-sit:client:callback', true) : alt.emitClient(player, 'altv-sit:client:callback', false);
});
