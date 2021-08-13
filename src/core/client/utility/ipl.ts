import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';

alt.onServer(SYSTEM_EVENTS.IPL_LOAD, (name: string) => {
    native.requestIpl(name);
});

alt.onServer(SYSTEM_EVENTS.IPL_UNLOAD, (name: string) => {
    native.removeIpl(name);
});
