import currency from '@AthenaServer/extensions/playerFunctions/currency';
import emit from '@AthenaServer/extensions/playerFunctions/emit';
import inventory from '@AthenaServer/extensions/playerFunctions/inventory';
import safe from '@AthenaServer/extensions/playerFunctions/safe';
import save from '@AthenaServer/extensions/playerFunctions/save';
import set from '@AthenaServer/extensions/playerFunctions/setter';
import sync from '@AthenaServer/extensions/playerFunctions/sync';
import utility from '@AthenaServer/extensions/playerFunctions/utility';
import getter from '@AthenaServer/extensions/playerFunctions/getter';

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
