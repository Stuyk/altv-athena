import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { Events } from '../shared/events';
import '../../clothing-generator/server';

function invoke(player: alt.Player) {
    player.emit(Events.toClient.open);
}

function applyComponent(
    player: alt.Player,
    dlcValue: string,
    id: number,
    value: number,
    isProp: boolean,
    isComponentValid: boolean,
) {
    let result;

    if (!isProp) {
        result = player.setDlcClothes(alt.hash(dlcValue), id, value, 0);
    } else {
        result = player.setDlcProp(alt.hash(dlcValue), id, value, 0);
    }

    if ((typeof result === 'boolean' && !result) || !isComponentValid) {
        return;
    }
}

Athena.systems.plugins.registerPlugin('clothingpreview', () => {
    Athena.commands.register('clothingpreview', '/clothingpreview', ['admin'], invoke);

    // Protected Set Component Function
    const setComponentRestricted = Athena.utility.restrict.create(applyComponent, {
        permissions: { account: ['admin'], character: [] },
        strategy: 'hasOne',
    });

    alt.onClient(Events.toServer.setComponent, setComponentRestricted);
});
