import * as alt from 'alt-client';
import { AthenaClient } from '../../../client/api/athena';
import { SpriteInfo } from '../../../client/rmlui/sprites';

const coinPositions = [
    {
        uid: undefined,
        x: -853.12255859375,
        y: -149.99351501464844,
        z: 37.728511810302734,
        isOnPlayer: false,
        coinIndex: 0,
    },
    {
        uid: undefined,
        x: -853.8956909179688,
        y: -146.2507781982422,
        z: 36.54151916503906,
        isOnPlayer: false,
        coinIndex: 0,
    },
    {
        uid: undefined,
        x: -845.1600952148438,
        y: -153.321044921875,
        z: 37.82341003417969,
        isOnPlayer: false,
        coinIndex: 0,
    },
    {
        uid: undefined,
        x: -840.4863891601562,
        y: -146.47177124023438,
        z: 37.874412536621094,
        isOnPlayer: false,
        coinIndex: 0,
    },
    {
        uid: undefined,
        x: -829.6448364257812,
        y: -141.73358154296875,
        z: 37.86702346801758,
        isOnPlayer: false,
        coinIndex: 0,
    },
    {
        uid: undefined,
        x: -831.4310302734375,
        y: -149.73548889160156,
        z: 37.85426712036133,
        isOnPlayer: false,
        coinIndex: 0,
    },
    {
        uid: undefined,
        x: -846.9716186523438,
        y: -140.86541748046875,
        z: 37.73107147216797,
        isOnPlayer: false,
        coinIndex: 0,
    },
    {
        uid: undefined,
        x: -857.094482421875,
        y: -135.50347900390625,
        z: 37.76114273071289,
        isOnPlayer: false,
        coinIndex: 0,
    },
    {
        uid: undefined,
        x: -868.7227783203125,
        y: -147.16026306152344,
        z: 37.898414611816406,
        isOnPlayer: false,
        coinIndex: 0,
    },
    {
        uid: undefined,
        x: -866.8389282226562,
        y: -162.26791381835938,
        z: 37.91914367675781,
        isOnPlayer: false,
        coinIndex: 0,
    },
];

const COIN_MAX = 8;
let coinIndex = 0;
let nextImageUpdate = Date.now() + 100;

function callOnTouch(uid: string) {
    AthenaClient.sprite.remove(uid);
}

for (let i = 0; i < coinPositions.length; i++) {
    coinPositions[i].uid = `coin-${i}`;
    AthenaClient.sprite.create({
        uid: coinPositions[i].uid,
        path: `@plugins/example-sprite/client/coin/${coinIndex}.png`,
        height: 50,
        width: 50,
        position: coinPositions[i] as alt.IVector3,
        callOnceOnTouch: callOnTouch,
    });
}

alt.setInterval(() => {
    const shouldRotateSprites = Date.now() > nextImageUpdate;
    if (shouldRotateSprites) {
        nextImageUpdate = Date.now() + 100;
    }

    for (let i = 0; i < coinPositions.length; i++) {
        let dataToUpdate: Partial<SpriteInfo> = {};

        if (shouldRotateSprites) {
            dataToUpdate.path = `@plugins/example-sprite/client/coin/${coinPositions[i].coinIndex}.png`;
        }

        if (coinPositions[i].isOnPlayer) {
            dataToUpdate.position = alt.Player.local.pos;
        }

        AthenaClient.sprite.update(`coin-${i}`, dataToUpdate);

        coinPositions[i].coinIndex += 1;
        if (coinPositions[i].coinIndex > COIN_MAX) {
            coinPositions[i].coinIndex = 0;
        }
    }
}, 0);
