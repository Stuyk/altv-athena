import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api';
import { Events } from '../shared/events';
import { MenuOptions } from '@AthenaClient/rmlui/menu/menuInterfaces';
import '../../clothing-generator/client';

const clothes = [
    { name: 'Mask', id: 1 },
    { name: 'Hair Style', id: 2 },
    { name: 'Torso', id: 3 },
    { name: 'Legs', id: 4 },
    { name: 'Bag', id: 5 },
    { name: 'Shoes', id: 6 },
    { name: 'Accessories', id: 7 },
    { name: 'Undershirts', id: 8 },
    { name: 'Body Armors', id: 9 },
    { name: 'Tops', id: 11 },
];

const props = [
    { name: 'Hat', id: 0 },
    { name: 'Glasses', id: 1 },
    { name: 'Ears', id: 2 },
    { name: 'Watches', id: 6 },
    { name: 'Bracelets', id: 7 },
];

// let pageIndex = 0;
// let dlcList = getDlcList();
// let currentDlc: string = '';
// let currentDlcKey: string = 'default';

// function* getDlcAsPageList(groups = 7) {
//     for (let i = 0; i < dlcList.length; i += groups) {
//         yield dlcList.slice(i, i + groups);
//     }
// }

// function getMenuEntries(dlcKey: string, isProp = false) {
//     const listToUse = alt.Player.local.model === alt.hash('mp_m_freemode_01') ? maleDlcList : femaleDlcList;
//     let options = [];

//     const data = listToUse[dlcKey] as DlcInfo;
//     const dataSet = data[isProp ? 'props' : 'components'];
//     const values = Object.values(dataSet);

//     console.log(dataSet);

//     for (let i = 0; i < values.length; i++) {
//         const id = i;
//         const maxValue = values[i];
//         const list = isProp ? props : clothes;
//         let name = 'Unknown';
//         const result = list.find((x) => x.id === id);
//         if (result) {
//             name = result.name;
//         } else {
//             continue;
//         }

//         if (maxValue <= 0) {
//             continue;
//         }

//         options.push({
//             type: 'Range',
//             title: name,
//             description: `Change value for ${name}`,
//             value: 0,
//             min: 0,
//             max: maxValue,
//             increment: 1,
//             callback: (newValue: number) => {
//                 alt.emitServer(Events.toServer.setComponent, currentDlc, id, newValue, isProp);
//             },
//         });
//     }

//     return options;
// }

// async function openClothingMenu(previousMenuCallback: Function, isProp = false) {
//     AthenaClient.systems.hotkeys.disable(27);

//     await AthenaClient.rmlui.menu.create({
//         header: {
//             title: isProp ? 'Props' : 'Clothing',
//             color: new alt.RGBA(0, 175, 250, 255),
//         },
//         options: [
//             ...getMenuEntries(currentDlcKey, false),
//             {
//                 type: 'Invoke',
//                 title: 'Back',
//                 description: 'Go back',
//                 callback() {
//                     AthenaClient.rmlui.menu.close();
//                 },
//             },
//         ],
//         callbackOnClose: async () => {
//             await alt.Utils.wait(250);
//             previousMenuCallback();
//             await alt.Utils.wait(250);
//             AthenaClient.systems.hotkeys.enable(27);
//         },
//     });
// }

// async function selectDlc(dlcKey: string, dlcToHash: string, previousMenuCallback: Function) {
//     AthenaClient.systems.hotkeys.disable(27);
//     currentDlc = dlcToHash;
//     currentDlcKey = dlcKey;

//     console.log(dlcKey, dlcToHash);

//     await AthenaClient.rmlui.menu.create({
//         header: {
//             title: dlcKey,
//             color: new alt.RGBA(0, 175, 250, 255),
//         },
//         options: [
//             {
//                 type: 'Invoke',
//                 title: 'Clothing',
//                 description: 'Open Clothing Menu',
//                 async callback() {
//                     await AthenaClient.rmlui.menu.close();
//                     await openClothingMenu(() => {
//                         selectDlc(dlcKey, dlcToHash, previousMenuCallback);
//                     });
//                 },
//             },
//             {
//                 type: 'Invoke',
//                 title: 'Props',
//                 description: 'Open Prop Menu',
//                 async callback() {
//                     await AthenaClient.rmlui.menu.close();
//                     await openClothingMenu(() => {
//                         selectDlc(dlcKey, dlcToHash, previousMenuCallback);
//                     }, true);
//                 },
//             },
//             {
//                 type: 'Invoke',
//                 title: 'Back',
//                 description: 'Go back',
//                 callback() {
//                     AthenaClient.rmlui.menu.close();
//                 },
//             },
//         ],
//         callbackOnClose: async () => {
//             await alt.Utils.wait(250);
//             previousMenuCallback();
//             await alt.Utils.wait(250);
//             AthenaClient.systems.hotkeys.enable(27);
//         },
//     });
// }

let dlc = 0;
let currentComponent = 0;

async function openClothingMenu(isProp = false) {
    const isMale = alt.Player.local.model === alt.hash('mp_m_freemode_01') ? true : false;
    const api = await AthenaClient.systems.plugins.useAPI('clothing-generator');
    if (!api) {
        throw new Error(`clothing-generator plugin is not loaded`);
    }

    const clothingList = isMale ? api.getMaleClothes() : api.getFemaleClothes();

    const options: MenuOptions = [];

    // Component Selector
    options.push({
        type: 'Selection',
        title: 'Select Component',
        description: 'Select a component to start modifying',
        options: clothes.map((x) => {
            return x.id;
        }),
        value: currentComponent,
        callback(component: number) {
            currentComponent = component;
        },
    });

    // Component Values

    if (isProp) {
        const components = Object.keys(clothingList.props[dlc]);
        for (let component of components) {
            const componentId = parseInt(component);
            const index = props.findIndex((x) => x.id === parseInt(component));
            if (index <= -1) {
                continue;
            }

            const drawables = Object.keys(clothingList.props[dlc][componentId]);
        }
    }
}

async function createMenu() {
    const isMale = alt.Player.local.model === alt.hash('mp_m_freemode_01') ? true : false;
    const api = await AthenaClient.systems.plugins.useAPI('clothing-generator');
    if (!api) {
        throw new Error(`clothing-generator plugin is not loaded`);
    }

    const clothingList = isMale ? api.getMaleClothes() : api.getFemaleClothes();
    const dlcs = [...new Set([...Object.keys(clothingList.clothing), ...Object.keys(clothingList.props)])];

    AthenaClient.systems.hotkeys.disable(27);
    await AthenaClient.rmlui.menu.create({
        header: {
            title: 'Clothing Previewer',
            color: new alt.RGBA(0, 175, 250, 255),
        },
        options: [
            {
                type: 'Selection',
                title: 'Select DLC',
                description: 'Select a DLC to browse clothing...',
                options: dlcs,
                value: 0,
                callback(dlcSelection: string) {
                    dlc = parseInt(dlcSelection);
                },
            },
            {
                type: 'Invoke',
                title: 'Clothing',
                description: 'Open the Clothing Menu',
                callback() {},
            },
            {
                type: 'Invoke',
                title: 'Props',
                description: 'Open the Props Menu',
                callback() {},
            },
        ],
        callbackOnClose: async () => {
            await alt.Utils.wait(250);
            AthenaClient.systems.hotkeys.enable(27);
        },
    });
}

alt.onServer(Events.toClient.open, createMenu);
