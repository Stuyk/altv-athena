import currency from '../../extensions/playerFunctions/currency';
import emit from '../../extensions/playerFunctions/emit';
import inventory from '../../extensions/playerFunctions/inventory';
import safe from '../../extensions/playerFunctions/safe';
import save from '../../extensions/playerFunctions/save';
import set from '../../extensions/playerFunctions/setter';
import sync from '../../extensions/playerFunctions/sync';
import utility from '../../extensions/playerFunctions/utility';
import getter from '../../extensions/playerFunctions/getter';

export const playerConst = {
    currency,
    emit,
    get: getter,
    inventory,
    safe,
    save,
    set,
    sync,
    utility,
};
