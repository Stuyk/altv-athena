import * as alt from 'alt-server';

// Shops are based on the index of arrays so -> First index -> First sellList
export const SELLERS: alt.Vector3[] = [
    { x: 1163.400634765625, y: -323.938232421875, z: 68.20509338378906 } as alt.Vector3 // SELLER (SHOP-POS) INDEX -> 0
    // { Add stuff yourself } Just another seller, INDEX 1 -> The secoond list will get into this position.
];

// Used to give all the shops are different blip, just copy the line as often as you need it.
export const sellersBlips = [
    { sprite: 52, color: 1, text: 'Seller Example - Index 0', scale: 1 }, // Index 0
];

const burgerBuyer = [
    { name: 'Burger', dbName: 'burger', price: 330, image: 'crate' }, // SellList INDEX -> 0
    // { Add stuff yourself. } Second Items for SELLERS Index -> 0
];
const anotherExampleList = [
    // { Fill me! } -> Index 1
];

export const sellLists = [burgerBuyer, /*anotherExampleList*/]; // Dont forget to add custom item lists here
