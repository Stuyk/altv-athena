import currency from '../../extensions/playerFunctions/currency';
import dataUpdater from '../../extensions/playerFunctions/dataUpdater';
import emit from '../../extensions/playerFunctions/emit';
import inventory from '../../extensions/playerFunctions/inventory';
import createNew from '../../extensions/playerFunctions/new';
import safe from '../../extensions/playerFunctions/safe';
import save from '../../extensions/playerFunctions/save';
import select from '../../extensions/playerFunctions/select';
import set from '../../extensions/playerFunctions/setter';
import sync from '../../extensions/playerFunctions/sync';
import utility from '../../extensions/playerFunctions/utility';
import getter from '../../extensions/playerFunctions/getter';

export const playerConst = {
    currency,
    dataUpdater,
    emit,
    get: getter,
    inventory,
    createNew,
    safe,
    save,
    select,
    set,
    sync,
    utility,
};
