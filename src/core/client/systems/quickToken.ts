import * as alt from 'alt-client';
import { SYSTEM_EVENTS } from '../../shared/enums/system';

alt.onServer(SYSTEM_EVENTS.QUICK_TOKEN_UPDATE, handleUpdateToken);

function handleUpdateToken(hash: string) {
    const instance = alt.LocalStorage.get();
    instance.set('qt', hash);
    instance.save();
}
