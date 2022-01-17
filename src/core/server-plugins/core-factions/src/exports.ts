import { FactionActions } from './actions';
import { FactionFuncs, FactionPlayerFuncs } from './funcs';
import { FactionHandler } from './handler';

export const factionFuncs = {
    actions: FactionActions,
    handler: FactionHandler,
    player: FactionPlayerFuncs,
    system: FactionFuncs,
};
