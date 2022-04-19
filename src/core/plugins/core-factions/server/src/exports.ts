import { FactionActions } from './actions';
import { FactionFuncs } from './funcs';
import { FactionHandler } from './handler';
import { FactionPlayerFuncs } from './playerFuncs';

export const factionFuncs = {
    actions: FactionActions,
    handler: FactionHandler,
    player: FactionPlayerFuncs,
    system: FactionFuncs,
};
