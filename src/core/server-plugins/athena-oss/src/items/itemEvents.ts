import * as alt from 'alt-server';
import { playerFuncs } from '../../../../server/extensions/extPlayer';
import { ANIMATION_FLAGS } from '../../../../shared/flags/animationFlags';
import IAttachable from '../../../../shared/interfaces/iAttachable';
import { Item } from '../../../../shared/interfaces/item';

alt.on('OSS:Server:SetFood', (player: alt.Player, item: Item) => {
    const attachedObject: IAttachable = {
        model: 'prop_cs_burger_01',
        bone: 57005,
        pos: { x: 0.15, y: -0.02, z: -0.05, },
        rot: { x: -180, y: -150, z: -95}
    }
    playerFuncs.emit.objectAttach(player, attachedObject, 6000);
    playerFuncs.emit.animation(player, 'amb@code_human_wander_eating_donut@male@idle_a', 'idle_c', 49, 6000);
    playerFuncs.safe.addFood(player, item.data.value);
    playerFuncs.emit.sound2D(player, item.data.sound);
});

alt.on('OSS:Server:SetWater', (player: alt.Player, item: Item) => {
    const attachedObject: IAttachable = {
        model: 'prop_beer_bottle',
        bone: 57005,
        pos: { x: 0.13, y: -0.12, z: -0.05 },
        rot: { x: 100, y: -220, z: 180}
    }
    playerFuncs.emit.objectAttach(player, attachedObject, 5000);
    playerFuncs.safe.addWater(player, item.data.value);
    playerFuncs.emit.animation(player, 'amb@world_human_drinking@beer@male@idle_a', 'idle_c', ANIMATION_FLAGS.NORMAL, 5000);
});