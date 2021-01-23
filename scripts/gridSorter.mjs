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

function distance2d(vector1, vector2) {
    if (vector1 === undefined || vector2 === undefined) {
        throw new Error('AddVector => vector1 or vector2 is undefined');
    }

    return Math.sqrt(Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2));
}

function sortListIntoGroups(name, items) {
    // Transform all properties to lowercase
    for (let i = 0; i < items.length; i++) {
        const itemData = Object.fromEntries(Object.entries(items[i]).map(([k, v]) => [k.toLowerCase(), v]));

        if (itemData.position) {
            itemData.position = Object.fromEntries(
                Object.entries(itemData.position).map(([k, v]) => [k.toLowerCase(), v])
            );
        }

        if (itemData.rotation) {
            itemData.rotation = Object.fromEntries(
                Object.entries(itemData.rotation).map(([k, v]) => [k.toLowerCase(), v])
            );
        }

        items[i] = itemData;
    }

    items = items.filter((item) => !item.name.includes('air'));

    // Set item as blip.
    // If the item is too close to anything else. Turn it into a blip.
    for (let i = 0; i < items.length; i++) {
        const closestItems = items.filter((item) => distance2d(item.position, items[i].position) <= 25);
        const hasBlip = closestItems.find((x) => x.isBlip);

        if (hasBlip) {
            continue;
        }

        closestItems[0].isBlip = true;
    }

    for (let i = 0; i < items.length; i++) {
        const pos = items[i].position;
        const index = currentGroups.findIndex((group) => pos.y >= group.minY && pos.y <= group.maxY);

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
