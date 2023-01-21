import { getters } from '../systems/getters';
import { configConst } from './consts/constConfig';
import { controllersConst } from './consts/constControllers';
import { dataConst } from './consts/constData';
import { databaseConst } from './consts/constDatabase';
import { documentsConst } from './consts/constDocuments';
import { eventsConst } from './consts/constEvents';
import { extensionsConst } from './consts/constExtensions';
import { injectionsConst } from './consts/constInjections';
import { playerConst } from './consts/constPlayer';
import { systemConst } from './consts/constSystem';
import { utilityConst } from './consts/constUtility';
import { vehicleConst } from './consts/constVehicle';
import { webviewConst } from './consts/constWebView';

export const Athena = {
    database: databaseConst,
    controllers: controllersConst,
    config: configConst,
    document: documentsConst,
    data: dataConst,
    events: eventsConst,
    extensions: extensionsConst,
    get: getters,
    injections: injectionsConst,
    player: playerConst,
    systems: systemConst,
    vehicle: vehicleConst,
    webview: webviewConst,
    utility: utilityConst,
};
