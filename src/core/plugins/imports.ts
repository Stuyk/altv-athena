import * as alt from 'alt-server';

import logger from '../server/utility/athenaLogger';
import { SYSTEM_EVENTS } from '../shared/enums/system';

const filePaths = [
    // GAMEMODE IMPORTS -- Remove what you don't want.
    './teleportEffect/teleporter',
    './heistExample/index',
    './deathLog/deathLog',
    './actionMenu/actionMenu',
    './interactionExample/index',
    './noMiniGun/index'
    // YOUR IMPORTS -- BELOW HERE
];

/**
 * But Stuyk, why don't you just make a recursive file reader?
 * Because load order is important.
 * If you have a plugin that needs to be loaded before any other plugin...
 * then you need a way to specify the priority of that file.
 * That's why it's built in this way.
 * @param startTime
 */
export default async function loadImports() {
    logger.info(`Loading extras folder...`);
    let extraResourcesCount = 0;
    for (let i = 0; i < filePaths.length; i++) {
        const result = await import(filePaths[i]).catch((err) => {
            console.error(err);
            return null;
        });

        if (!result) {
            logger.error(`Failed to load resource: ${filePaths[i]}`);
            continue;
        }

        if (result.default) {
            result.default();
        }

        logger.log(`Loaded: ${filePaths[i]}`);
        extraResourcesCount += 1;
    }

    logger.info(`Extra Resources Loaded: ${extraResourcesCount}`);
    alt.emit(SYSTEM_EVENTS.BOOTUP_ENABLE_ENTRY);
}

loadImports();
