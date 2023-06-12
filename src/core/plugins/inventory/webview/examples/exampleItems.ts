import { Item } from '@AthenaShared/interfaces/item';

const exampleItem: Item = {
    name: 'Big Box',
    dbName: 'box',
    quantity: 2,
    slot: 0,
    data: {},
    version: 0,
    weight: 1,
    icon: 'assets/icons/crate.png',
};

const exampleItems: Array<Item> = [
    exampleItem,
    { ...exampleItem, slot: 2, icon: 'burger', name: 'Burger but with a long name', totalWeight: 2 },
    { ...exampleItem, slot: 7, icon: 'burger', quantity: 5, name: 'Burger', totalWeight: 5 },
    { ...exampleItem, slot: 16, icon: 'pistol', name: 'Pistol .50', totalWeight: 4, isEquipped: false },
    { ...exampleItem, slot: 18, icon: 'pistol50', name: 'Pistol .50', totalWeight: 4, isEquipped: true },
];

export { exampleItem, exampleItems };
