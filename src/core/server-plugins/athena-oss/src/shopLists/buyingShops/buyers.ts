import * as alt from 'alt-server';

export const BUYERS: alt.Vector3[] = [
    { x: 25.980966567993164, y: -1345.6417236328125, z: 28.497024536132812 } as alt.Vector3, // Index 0
    { x: 374.3475341796875, y: 328.112060546875, z: 102.56637573242188 } as alt.Vector3, // Index 1
    { x: -3041.32763671875, y: 585.155029296875, z: 6.908928871154785 } as alt.Vector3, // Index 2
    { x: -3243.743408203125, y: 1001.3903198242188, z: 11.830706596374512 } as alt.Vector3, // Index 3
    { x: 548.0447387695312, y: 2669.48876953125, z: 41.156490325927734 } as alt.Vector3, // Index 4
    { x: 1960.2322998046875, y: 3742.317138671875, z: 31.343746185302734 } as alt.Vector3, // Index 5
    { x: 1730.01171875, y: 6416.22021484375, z: 34.03722381591797 } as alt.Vector3, // Index 6
    { x: 2555.4609375, y: 382.1643371582031, z: 107.62295532226562 } as alt.Vector3, // Index 7
    { x: -48.5690803527832, y: -1757.6961669921875, z: 28.4210147857666 } as alt.Vector3, // Index 8
    { x: 1163.400634765625, y: -323.938232421875, z: 68.20509338378906 } as alt.Vector3, // Index 9
    { x: -707.4390258789062, y: -914.5612182617188, z: 18.21558952331543 } as alt.Vector3, // Index 10
    { x: 1697.968505859375, y: 4924.54833984375, z: 41.06367492675781 } as alt.Vector3, // Index 11
    { x: -1820.6717529296875, y: 792.8975219726562, z: 137.11163330078125 } as alt.Vector3, // Index 12
    { x: 1135.9544677734375, y: -981.8599853515625, z: 45.41580581665039 } as alt.Vector3, // Index 13
    { x: -1222.91162109375, y: -907.1942749023438, z: 11.326356887817383 } as alt.Vector3, // Index 14
    { x: -1487.08349609375, y: -379.2518005371094, z: 39.163429260253906 } as alt.Vector3, // Index 15
    { x: -2967.888427734375, y: 390.76654052734375, z: 14.043313026428223 } as alt.Vector3, // Index 16
    { x: 1166.243896484375, y: 2709.356689453125, z: 37.15770721435547 } as alt.Vector3, // Index 17
    { x: 1393.5035400390625, y: 3605.268798828125, z: 33.98093032836914 } as alt.Vector3, // Index 18
    { x: 2748.77392578125, y: 3472.442626953125, z: 55.67741012573242 - 1 } as alt.Vector3, // Index 19
    { x: 21.903297424316406, y: -1108.140625, z: 29.785400390625 } as alt.Vector3, // Index 20
    { x: -330.4879150390625, y: 6083.93408203125, z: 31.4534912109375 } as alt.Vector3, // Index 21
    { x: 1693.3714599609375, y: 3760.12744140625, z: 34.6885986328125 } as alt.Vector3, // Index 22
    { x: -1117.4769287109375, y: 2698.839599609375, z: 18.5465087890625 } as alt.Vector3, // Index 23
    { x: 2567.301025390625, y: 294.1450500488281, z: 108.7266845703125 } as alt.Vector3, // Index 24
    { x: 251.92088317871094, y: -50.36043930053711, z: 69.9384765625 } as alt.Vector3, // Index 25
    { x: -1305.982421875, y: -394.4703369140625, z: 36.6937255859375 } as alt.Vector3, // Index 26
    { x: -661.9384765625, y: -935.2879028320312, z: 21.8154296875 } as alt.Vector3, // Index 27
    { x: 842.1626586914062, y: -1033.81982421875, z: 28.1845703125 } as alt.Vector3, // Index 28
    { x: 810.0263671875, y: -2157.177978515625, z: 29.6168212890625 } as alt.Vector3, // Index 29
    { x: -560.1758422851562, y: 286.4307556152344, z: 82.17138671875 } as alt.Vector3, // Index 30
    { x: -1394.1494140625, y: -603.96923828125, z: 30.3077392578125 } as alt.Vector3, // Index 31
    { x: -1377.6131591796875, y: -627.3362426757812, z: 30.813232421875 } as alt.Vector3, // Index 32
    { x: 127.16043853759766, y: -1283.4989013671875, z: 29.2630615234375 } as alt.Vector3, // Index 33
];

// Used to give all the shops are different blip, just copy the line as often as you need it.
export const buyerBlips = [
    { sprite: 59, color: 2, text: '24/7 Shop', scale: 1 }, // Index 0
    { sprite: 59, color: 2, text: '24/7 Shop', scale: 1 }, // Index 1
    { sprite: 59, color: 2, text: '24/7 Shop', scale: 1 }, // Index 2
    { sprite: 59, color: 2, text: '24/7 Shop', scale: 1 }, // Index 3
    { sprite: 59, color: 2, text: '24/7 Shop', scale: 1 }, // Index 4
    { sprite: 59, color: 2, text: '24/7 Shop', scale: 1 }, // Index 5
    { sprite: 59, color: 2, text: '24/7 Shop', scale: 1 }, // Index 6
    { sprite: 59, color: 2, text: '24/7 Shop', scale: 1 }, // Index 7
    { sprite: 59, color: 2, text: 'LTD', scale: 1 }, // Index 8
    { sprite: 59, color: 2, text: 'LTD', scale: 1 }, // Index 9
    { sprite: 59, color: 2, text: 'LTD', scale: 1 }, // Index 10
    { sprite: 59, color: 2, text: 'LTD', scale: 1 }, // Index 11
    { sprite: 59, color: 2, text: 'LTD', scale: 1 }, // Index 12
    { sprite: 59, color: 2, text: 'Robs Liquor', scale: 1 }, // Index 13
    { sprite: 59, color: 2, text: 'Robs Liquor', scale: 1 }, // Index 14
    { sprite: 59, color: 2, text: 'Robs Liquor', scale: 1 }, // Index 15
    { sprite: 59, color: 2, text: 'Robs Liquor', scale: 1 }, // Index 16
    { sprite: 59, color: 2, text: 'Juice', scale: 1 }, // Index 17
    { sprite: 59, color: 2, text: 'Liquor ACE', scale: 1 }, // Index 18
    { sprite: 59, color: 2, text: 'Tool Shop', scale: 1 }, // Index 19
    { sprite: 110, color: 2, text: 'Ammunation', scale: 1 }, // Index 20
    { sprite: 110, color: 2, text: 'Ammunation', scale: 1 }, // Index 21
    { sprite: 110, color: 2, text: 'Ammunation', scale: 1 }, // Index 22
    { sprite: 110, color: 2, text: 'Ammunation', scale: 1 }, // Index 23
    { sprite: 110, color: 2, text: 'Ammunation', scale: 1 }, // Index 24
    { sprite: 110, color: 2, text: 'Ammunation', scale: 1 }, // Index 25
    { sprite: 110, color: 2, text: 'Ammunation', scale: 1 }, // Index 26
    { sprite: 110, color: 2, text: 'Ammunation', scale: 1 }, // Index 27
    { sprite: 110, color: 2, text: 'Ammunation', scale: 1 }, // Index 28
    { sprite: 110, color: 2, text: 'Ammunation', scale: 1 }, // Index 29
    { sprite: 93, color: 48, text: 'Tequi-la-la', scale: 1 }, // Index 30
    { sprite: 93, color: 48, text: 'Bahama Mamas', scale: 1 }, // Index 31
    { sprite: 93, color: 48, text: 'Bahama Mamas', scale: 1 }, // Index 32
    { sprite: 93, color: 48, text: 'Vanilla Unicorn', scale: 1 }, // Index 33
];

// In OSS each Shop can hold individual items or you can add the same list to a few more stores over and over again.
// Default List for all 24/7 & LTD Stores.
const shopList = [
    { name: 'Bread', dbName: 'bread', price: 75, image: 'crate' },
    { name: 'Hotdog', dbName: 'Shophotdog', price: 375, image: 'crate' },
    { name: 'Waterbottle', dbName: 'Shopwater', price: 250, image: 'crate' },
    { name: 'Cola', dbName: 'Shopcola', price: 250, image: 'crate'},
    { name: 'Energy Drink', dbName: 'Shopenergy', price: 300, image: 'crate'}
];

// Default List for all Ammunations
const ammunationList = [
    { name: 'Pistol', dbName: 'Pistol', price: 50000, image: 'pistol' },
    { name: 'Railgun', dbName: 'Railgun', price: 500000, image: 'railgun' }
];

export const buyLists = [
    shopList,
    shopList,
    shopList,
    shopList,
    shopList,
    shopList,
    shopList,
    shopList,
    null, // LTD
    null, // LTD
    null, // LTD
    null, // LTD
    null, // LTD
    null, // Robs Liquor
    null, // Robs Liquor
    null, // Robs Liquor
    null, // Robs Liquor
    null, // Juice
    null, // Liquor Ace
    null, // Tool Shop
    ammunationList,
    ammunationList,
    ammunationList,
    ammunationList,
    ammunationList,
    ammunationList,
    ammunationList,
    ammunationList,
    ammunationList,
    ammunationList,
    null, // Tequi-la-la
    null, // Bahama Mamas
    null, // Bahama Mamas
    null // Vanilla Unicorn
    /*anotherExampleList*/,
]; // ADD YOUR LISTS HERE!
