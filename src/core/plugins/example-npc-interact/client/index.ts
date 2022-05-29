import * as native from 'natives';
import { NpcWheelMenu } from '../../../client/menus/npc';
import { IPed } from '../../../shared/interfaces/iPed';
import { IWheelOptionExt } from '../../../shared/interfaces/wheelMenu';
import { EXAMPLE_NPC_INTERACT } from '../shared/info';

class InternalFunctions {
    static init() {
        NpcWheelMenu.addInjection(InternalFunctions.handleInjection);
    }

    static handleInjection(scriptID: number, ped: IPed, options: Array<IWheelOptionExt>): Array<IWheelOptionExt> {
        // This is not the NPC we are looking for.
        if (!ped.uid.includes(EXAMPLE_NPC_INTERACT.PREFIX)) {
            return options;
        }

        options.push({
            name: 'Turn Invisible',
            callback: () => {
                native.setEntityAlpha(scriptID, 0, false);
            },
        });

        options.push({
            name: 'Turn Visible',
            callback: () => {
                native.setEntityAlpha(scriptID, 255, false);
            },
        });

        return options;
    }
}

InternalFunctions.init();
