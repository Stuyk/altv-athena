import axios from 'axios';
import fs from 'fs';

const dataGroups = [
    {
        name: 'atm',
        url: `https://raw.githubusercontent.com/DurtyFree/gta-v-data-dumps/master/objectslocations/worldAtms.json`
    },
    {
        name: 'gas',
        url: `https://raw.githubusercontent.com/DurtyFree/gta-v-data-dumps/master/objectslocations/worldGasPumps.json`
    },
    {
        name: 'vending',
        url: `https://raw.githubusercontent.com/DurtyFree/gta-v-data-dumps/master/objectslocations/worldVendingMachines.json`
    }
];

const maxY = 8000;
const minY = -4000;

const currentGroups = generateMinMaxs(6);

function generateMinMaxs(division = 6) {
    let groups = [];
    let total = maxY + Math.abs(minY);

    for (let i = 0; i < division; i++) {
        const result = {
            maxY: maxY - (total / division) * i,
            minY: maxY - 2000 - (total / division) * i,
            objects: {}
        };

        groups.push(result);
    }

    return groups;
}

function sortListIntoGroups(name, items) {
    for (let i = 0; i < items.length; i++) {
        const pos = items[i].Position;
        const index = currentGroups.findIndex((group) => pos.Y >= group.minY && pos.Y <= group.maxY);

        if (index <= -1) {
            continue;
        }

        if (!currentGroups[index].objects[name]) {
            currentGroups[index].objects[name] = [];
        }

        currentGroups[index].objects[name].push(items[i]);
    }
}

(async () => {
    console.log(`Beginning Parser. Please wait...`);
    for (let i = 0; i < dataGroups.length; i++) {
        const name = dataGroups[i].name;
        const url = dataGroups[i].url;
        const result = await axios.get(url).catch((err) => {
            return null;
        });

        if (!result) {
            console.error(`Could not fetch data group for: ${name}`);
            continue;
        }

        await sortListIntoGroups(name, result.data);
    }

    console.log(`Writing to file...`);
    fs.writeFileSync('./grid-propogation.json', JSON.stringify(currentGroups, null, '\t'));
    console.log(`Done.`);
})();
