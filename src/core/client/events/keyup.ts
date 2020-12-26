import * as alt from 'alt-client';
import * as native from 'natives';

alt.on('keyup', handleKeyUp);

function handleKeyUp(key: number) {
    if (key === 112) {
        alt.log(`POSITION:`);
        const pos = { ...alt.Player.local.pos };
        alt.log(JSON.stringify(pos));

        alt.log(`ROTATION:`);
        const rot = { ...alt.Player.local.rot };
        alt.log(JSON.stringify(rot));

        alt.log(`HEADING:`);
        const heading = native.getEntityHeading(alt.Player.local.scriptID);
        alt.log(heading);
    }
}
