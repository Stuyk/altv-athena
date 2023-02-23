import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import { ClothingComponent, StoredItem } from '@AthenaShared/interfaces/item';
import { clothingComponentToIconName, clothingItemToIconName } from '@AthenaShared/utility/clothing';

Athena.systems.messenger.commands.register(
    'setclothing',
    '/setclothing [id] [drawable] [texture] [?create]',
    ['admin'],
    async (
        player: alt.Player,
        id: string | undefined,
        drawable: string | undefined,
        texture: string | undefined,
        create: string,
    ) => {
        if (typeof id === 'undefined') {
            Athena.player.emit.message(player, `Must specify an id`);
            return;
        }

        if (typeof drawable === 'undefined') {
            Athena.player.emit.message(player, `Must specify an drawable`);
            return;
        }

        if (typeof texture === 'undefined') {
            Athena.player.emit.message(player, `Must specify an texture`);
            return;
        }

        const idReal = parseInt(id);
        const drawableReal = parseInt(drawable);
        const textureReal = parseInt(texture);

        if (isNaN(idReal) || isNaN(drawableReal) || isNaN(textureReal)) {
            Athena.player.emit.message(player, `One of the specified parameters was not a number.`);
            return;
        }

        Athena.player.emit.message(player, `Clothing Component Set: ${idReal} ${drawableReal} ${textureReal}`);
        player.setClothes(idReal, drawableReal, textureReal, 0);

        if (typeof create === 'undefined') {
            return;
        }

        const data = Athena.document.character.get(player);
        const storableItem = Athena.systems.inventory.clothing.outfitFromPlayer(player, [{ id: idReal }]);
        const result = await Athena.systems.inventory.manager.add(storableItem, data.inventory, 'inventory');
        if (typeof result === 'undefined') {
            return;
        }

        await Athena.document.character.set(player, 'inventory', result);
    },
);

Athena.systems.messenger.commands.register(
    'getclothing',
    '/getclothing [id]',
    ['admin'],
    (player: alt.Player, id: string | undefined) => {
        if (typeof id === 'undefined') {
            Athena.player.emit.message(player, `Must specify an id`);
            return;
        }

        const idReal = parseInt(id);

        if (isNaN(idReal)) {
            Athena.player.emit.message(player, `One of the specified parameters was not a number.`);
            return;
        }

        const dlcInfo = player.getDlcClothes(idReal);
        const componentInfo: ClothingComponent = {
            id: idReal,
            ...dlcInfo,
        };

        const data = Athena.document.character.get(player);

        const stringData = JSON.stringify(componentInfo);
        Athena.player.emit.message(player, stringData);
        alt.log(stringData);
        alt.log(`Create an Icon Named: ${clothingComponentToIconName(data.appearance.sex, [componentInfo])}`);
    },
);

Athena.systems.messenger.commands.register(
    'setprop',
    '/setprop [id] [drawable] [texture] [?create]',
    ['admin'],
    async (
        player: alt.Player,
        id: string | undefined,
        drawable: string | undefined,
        texture: string | undefined,
        create: string,
    ) => {
        if (typeof id === 'undefined') {
            Athena.player.emit.message(player, `Must specify an id`);
            return;
        }

        if (typeof drawable === 'undefined') {
            Athena.player.emit.message(player, `Must specify an drawable`);
            return;
        }

        if (typeof texture === 'undefined') {
            Athena.player.emit.message(player, `Must specify an texture`);
            return;
        }

        const idReal = parseInt(id);
        const drawableReal = parseInt(drawable);
        const textureReal = parseInt(texture);

        if (isNaN(idReal) || isNaN(drawableReal) || isNaN(textureReal)) {
            Athena.player.emit.message(player, `One of the specified parameters was not a number.`);
            return;
        }

        Athena.player.emit.message(player, `Prop Component Set: ${idReal} ${drawableReal} ${textureReal}`);
        player.setProp(idReal, drawableReal, textureReal);

        if (typeof create === 'undefined') {
            return;
        }

        const data = Athena.document.character.get(player);
        const storableItem = Athena.systems.inventory.clothing.outfitFromPlayer(player, [{ id: idReal, isProp: true }]);
        const result = await Athena.systems.inventory.manager.add(storableItem, data.inventory, 'inventory');
        if (typeof result === 'undefined') {
            return;
        }

        await Athena.document.character.set(player, 'inventory', result);
    },
);

Athena.systems.messenger.commands.register(
    'getprop',
    '/getprop [id]',
    ['admin'],
    (player: alt.Player, id: string | undefined) => {
        if (typeof id === 'undefined') {
            Athena.player.emit.message(player, `Must specify an id`);
            return;
        }

        const idReal = parseInt(id);

        if (isNaN(idReal)) {
            Athena.player.emit.message(player, `One of the specified parameters was not a number.`);
            return;
        }

        const dlcInfo = player.getDlcProp(idReal);
        const componentInfo: ClothingComponent = {
            id: idReal,
            ...dlcInfo,
            isProp: true,
        };

        const data = Athena.document.character.get(player);

        const stringData = JSON.stringify(componentInfo);
        Athena.player.emit.message(player, stringData);
        alt.log(stringData);
        alt.log(`Create an Icon Named: ${clothingComponentToIconName(data.appearance.sex, [componentInfo])}`);
    },
);
