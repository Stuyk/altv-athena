import * as alt from 'alt-client';

alt.onServer('meta:Set', handleSetMeta);

function handleSetMeta(key, value) {
    if (!alt.Player.local.meta) {
        alt.Player.local.meta = {};
    }

    alt.Player.local.meta[key] = value;
}
