import * as alt from 'alt-client';

alt.on('keyup', handleKeyUp);

function handleKeyUp(key: number) {
    if (key === 112) {
        const pos = { ...alt.Player.local.pos };
        alt.log(JSON.stringify(pos));
    }
}
