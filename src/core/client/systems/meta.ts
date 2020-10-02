import * as alt from 'alt-client';
import { Events_Meta } from '../../shared/enums/meta';

alt.onServer(Events_Meta.Set, handleSetMeta);

function handleSetMeta(key, value) {
    if (!alt.Player.local.meta) {
        alt.Player.local.meta = {};
    }

    alt.Player.local.meta[key] = value;
}
