import * as alt from 'alt-client';
import { Events_Misc } from '../../shared/enums/events';

alt.onServer(Events_Misc.DiscordTokenUpdate, handleUpdateToken);

function handleUpdateToken(hash: string) {
    const instance = alt.LocalStorage.get();
    instance.set('qt', hash);
    instance.save();
}
