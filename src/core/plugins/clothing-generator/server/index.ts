import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api';
import fs from 'fs';
import { Events } from '../shared/events';
import { ClothingList } from '../shared/interfaces';
import { maleClothes } from '../shared/maleClothes';
import { femaleClothes } from '../shared/femaleClothes';
import { PLUGIN_NAME } from '../shared/pluginName';

let data: ClothingList = {
    clothing: {},
    props: {},
};

function clearData() {
    data = {
        clothing: {},
        props: {},
    };
}

function setComponent(player: alt.Player, id: number, drawable: number, texture: number, isProp: boolean) {
    if (isProp) {
        player.setProp(id, drawable, texture);
    } else {
        player.setClothes(id, drawable, texture);
    }

    if (isProp) {
        const dlcInfo = player.getDlcClothes(id);

        if (!data.props[dlcInfo.dlc]) {
            data.props[dlcInfo.dlc] = {};
        }

        if (!data.props[dlcInfo.dlc][id]) {
            data.props[dlcInfo.dlc][id] = {};
        }

        data.props[dlcInfo.dlc][id][drawable] = texture;
    } else {
        const dlcInfo = player.getDlcClothes(id);

        if (!data.clothing[dlcInfo.dlc]) {
            data.clothing[dlcInfo.dlc] = {};
        }

        if (!data.clothing[dlcInfo.dlc][id]) {
            data.clothing[dlcInfo.dlc][id] = {};
        }

        data.clothing[dlcInfo.dlc][id][drawable] = texture;
    }
}

function writeToFile(player: alt.Player) {
    let fileName = player.model === alt.hash('mp_m_freemode_01') ? 'maleClothes' : 'femaleClothes';
    const dataToWrite = JSON.stringify(data, null, '\t');
    fs.writeFileSync(fileName + '.ts', `export const ${fileName} = ${dataToWrite}`);
    alt.log(`====== Clothing Generator =======`);
    alt.log(`${fileName}.ts was created in the main Athena Directory.`);
    alt.log(` `);
    alt.log(`Move the file to:`);
    alt.log(`src/core/plugins/clothing-generator/shared`);
    alt.log(` `);
    alt.log(`Restart your server after this has been completed to update clothing lists.`);
}

Athena.systems.plugins.registerPlugin(PLUGIN_NAME, () => {
    // These will only load if the server is in debug mode.
    // They should only be used in a non-production environment.
    if (alt.debug) {
        alt.onClient(Events.toServer.set, setComponent);
        alt.onClient(Events.toServer.finish, writeToFile);

        Athena.commands.register(
            'genfclothes',
            '/genfclothes - Generate Female Clothing Lists',
            ['admin'],
            async (player) => {
                clearData();
                player.model = 'mp_f_freemode_01';
                player.emit(Events.toClient.start);
            },
        );

        Athena.commands.register(
            'genmclothes',
            '/genmclothes - Generate Male Clothing Lists',
            ['admin'],
            async (player) => {
                clearData();
                player.model = 'mp_m_freemode_01';
                player.emit(Events.toClient.start);
            },
        );
    }

    Athena.systems.plugins.addAPI(PLUGIN_NAME, clothingData);
});

// Plugin Exports
const clothingData = {
    getMaleClothes(): ClothingList {
        return maleClothes;
    },
    getFemaleClothes(): ClothingList {
        return femaleClothes;
    },
};

declare global {
    export interface ServerPluginAPI {
        [PLUGIN_NAME]: typeof clothingData;
    }
}
