import * as alt from 'alt-server';

// Should be able to register a callback that applies to all players that join.
// Should keep track of all players current login flow.
// The login flow can be moved forward for individual players.

export interface FlowInfo {
    name: string;
    weight: number;
    callback: (player: alt.Player) => void;
}

const playerFlow: { [id: string]: { index: number; flow: Array<FlowInfo> } } = {};
let weightedFlow: Array<FlowInfo> = [];

/**
 * Adds a flow option to the login flow.
 *
 * @param {string} name
 * @param {number} weight
 * @param {(player: alt.Player) => void} callback
 * @return {boolean}
 */
export function add(name: string, weight: number, callback: (player: alt.Player) => void): boolean {
    if (Overrides.add) {
        return Overrides.add(name, weight, callback);
    }

    name = name.toLowerCase();

    for (let i = 0; i < weightedFlow.length; i++) {
        if (weightedFlow[i].name === name) {
            alt.logWarning(
                `Login Flow -> ${name} was already registered. Skipped adding. Change name to fix this issue.`,
            );

            return false;
        }

        if (weightedFlow[i].weight === weight) {
            alt.logWarning(
                `Login Flow -> ${name} is using an existing weight. Did not add. Change weight to fix this issue.`,
            );

            return false;
        }
    }

    weightedFlow.push({ name, weight, callback });
    weightedFlow = weightedFlow.sort((a, b) => {
        return a.weight - b.weight;
    });

    return true;
}

/**
 * Removes weighted flow info by name.
 *
 * @param {string} name
 * @return {boolean}
 */
export function remove(name: string): boolean {
    if (Overrides.remove) {
        return Overrides.remove(name);
    }

    name = name.toLowerCase();

    const index = weightedFlow.findIndex((x) => x.name === name);
    if (index <= -1) {
        return false;
    }

    weightedFlow.splice(index, 1);
    return true;
}

/**
 * Returns all currently registered flow information, their weight, name, and callbacks.
 * @return {Array<FlowInfo>}
 */
export function getWeightedFlow(): Array<FlowInfo> {
    if (Overrides.getWeightedFlow) {
        return Overrides.getWeightedFlow();
    }

    return weightedFlow;
}

/**
 * Return the flow that a player is currently utilizing.
 *
 * @param {alt.Player} player An alt:V Player Entity
 * @return {{ index: number; flow: Array<FlowInfo> }}
 */
export function getFlow(player: alt.Player): { index: number; flow: Array<FlowInfo> } {
    if (Overrides.getFlow) {
        return Overrides.getFlow(player);
    }

    return playerFlow[player.id];
}

/**
 * Registers a player to start a login flow.
 * Invokes the first callable function in the weighted flow.
 *
 * @param {alt.Player} player An alt:V Player Entity
 */
export function register(player: alt.Player) {
    if (Overrides.register) {
        return Overrides.register(player);
    }

    playerFlow[player.id] = { index: 0, flow: [...weightedFlow] };
    playerFlow[player.id].flow[0].callback(player);
}

/**
 * Unregister player flow information.
 *
 * @param {alt.Player} player An alt:V Player Entity
 */
export function unregister(player: alt.Player) {
    if (Overrides.unregister) {
        return Overrides.unregister(player);
    }

    delete playerFlow[player.id];
}

/**
 * Invokes the next flow for an individual player.
 * If the array index exceeds the total amount of available registered flows.
 * It will spawn the player.
 *
 * @param {alt.Player} player An alt:V Player Entity
 */
export function next(player: alt.Player) {
    if (Overrides.next) {
        return Overrides.next(player);
    }

    if (!playerFlow[player.id]) {
        register(player);
        return;
    }

    playerFlow[player.id].index += 1;

    const index = playerFlow[player.id].index;
    if (!playerFlow[player.id].flow[index]) {
        delete playerFlow[player.id];
        return;
    }

    playerFlow[player.id].flow[index].callback(player);
}

/**
 * Go straight to the final section of login flow. Which is a character select.
 *
 * @export
 * @param {alt.Player} player
 */
export function goToEnd(player: alt.Player) {
    if (!playerFlow[player.id]) {
        register(player);
    }

    playerFlow[player.id].index = playerFlow[player.id].flow.length - 1;
    playerFlow[player.id].flow[playerFlow[player.id].index].callback(player);
}

alt.on('playerDisconnect', (player: alt.Player) => {
    delete playerFlow[player.id];
});

interface LoginFlowFuncs {
    add: typeof add;
    remove: typeof remove;
    getWeightedFlow: typeof getWeightedFlow;
    getFlow: typeof getFlow;
    register: typeof register;
    unregister: typeof unregister;
    next: typeof next;
}

const Overrides: Partial<LoginFlowFuncs> = {};

export function override(functionName: 'add', callback: typeof add);
export function override(functionName: 'remove', callback: typeof remove);
export function override(functionName: 'getWeightedFlow', callback: typeof getWeightedFlow);
export function override(functionName: 'getFlow', callback: typeof getFlow);
export function override(functionName: 'register', callback: typeof register);
export function override(functionName: 'unregister', callback: typeof unregister);
export function override(functionName: 'next', callback: typeof next);
/**
 * Used to override login flow functions.
 *
 *
 * @param {keyof LoginFlowFuncs} functionName
 * @param {*} callback
 */
export function override(functionName: keyof LoginFlowFuncs, callback: any): void {
    Overrides[functionName] = callback;
}
