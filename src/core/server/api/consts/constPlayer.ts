import currency from '@AthenaServer/extensions/playerFunctions/currency';
import emit from '@AthenaServer/extensions/playerFunctions/emit';
import safe from '@AthenaServer/extensions/playerFunctions/safe';
import set from '@AthenaServer/extensions/playerFunctions/setter';
import sync from '@AthenaServer/extensions/playerFunctions/sync';
import utility from '@AthenaServer/extensions/playerFunctions/utility';
import getter from '@AthenaServer/extensions/playerFunctions/getter';

export const playerConst = {
    currency,
    emit,
    get: getter,
    safe,
    set,
    sync,
    utility,
};
