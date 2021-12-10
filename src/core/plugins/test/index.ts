import * as alt from 'alt-server';
import { playerFuncs } from '../../server/extensions/Player';
import { ServerMarkerController } from '../../server/streamers/marker';

ServerMarkerController.append({ pos: { x: 0, y: 0, z: 0 }, color: { r: 255, g: 255, b: 255, a: 255 }, type: 0 });

alt.on('playerConnect', (player: alt.Player) => {
    playerFuncs.emit.message(player, 'hi');
});
