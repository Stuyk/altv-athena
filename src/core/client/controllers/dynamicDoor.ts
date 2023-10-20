import * as alt from 'alt-client';
import * as AthenaClient from '@AthenaClient/api/index.js';
import * as native from 'natives';

AthenaClient.systems.rpc.on('load-ipl', (iplName: string) => {
    alt.requestIpl(iplName);
    alt.Utils.waitFor(() => native.isIplActive(iplName));
    return native.isIplActive(iplName);
});

AthenaClient.systems.rpc.on('unload-ipl', (iplName: string) => {
    alt.removeIpl(iplName);
    alt.Utils.waitFor(() => native.isIplActive(iplName) === false);
});

AthenaClient.systems.rpc.on('load-ytyp', (ytypPath: string) => {
    alt.loadYtyp(ytypPath);
});

AthenaClient.systems.rpc.on('unload-ytyp', (ytypPath: string) => {
    alt.unloadYtyp(ytypPath);
});
