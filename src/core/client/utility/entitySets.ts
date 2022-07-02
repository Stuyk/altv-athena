import * as alt from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';

alt.onServer(SYSTEM_EVENTS.ENTITYSET_ACTIVATE, (interior: number, entitySetName: string) => {
    native.activateInteriorEntitySet(interior, entitySetName);
    native.refreshInterior(interior);
});

alt.onServer(SYSTEM_EVENTS.ENTITYSET_DEACTIVATE, (interior: number, entitySetName: string) => {
    native.deactivateInteriorEntitySet(interior, entitySetName);
    native.refreshInterior(interior);
});

alt.onServer(SYSTEM_EVENTS.ENTITYSET_IS_ACTIVE, (interior: number, entitySetName: string) => {
    let result;
    result = native.isInteriorEntitySetActive(interior, entitySetName);
    alt.emitServer(SYSTEM_EVENTS.ENTITYSET_IS_ACTIVE, result);
});
