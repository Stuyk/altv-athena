import { StateManager } from '../../systems/stateManager';

export const stateConst = {
    get: StateManager.get,
    on: StateManager.on,
    set: StateManager.set,
    setBulk: StateManager.setBulk,
    subscribe: StateManager.subscribe,
};
