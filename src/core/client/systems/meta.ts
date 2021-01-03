import * as alt from 'alt-client';
import { Events_Meta } from '../../shared/enums/meta';

alt.onServer(Events_Meta.Set, handleSetMeta);

function handleSetMeta(key, value) {
    if (!alt.Player.local.meta) {
        alt.Player.local.meta = {};
    }

    alt.emit(Events_Meta.Changed, key, value, alt.Player.local.meta[key]);
    alt.Player.local.meta[key] = value;
}
