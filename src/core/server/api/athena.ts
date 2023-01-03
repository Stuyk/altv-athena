import { getters } from '../systems/getters';
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
import { viewsConst } from './consts/constViews';
import { webviewConst } from './consts/constWebView';

export const Athena = {
    database: databaseConst,
    controllers: controllersConst,
    document: documentsConst,
    data: dataConst,
    events: eventsConst,
    extensions: extensionsConst,
    get: getters,
    injections: injectionsConst,
    player: playerConst,
    systems: systemConst,
    vehicle: vehicleConst,
    views: viewsConst,
    webview: webviewConst,
    utility: utilityConst,
};
