import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/System';
import { IStreamPolygon } from '../../shared/interfaces/IStreamPolygon';
import { StreamerService } from '../systems/streamer';
import { sha256Random } from '../utility/encryption';

const KEY = 'polygons';
const globalPolygons: { [key: string]: IStreamPolygon } = {};

/**
 * Should not be exported. Do not export.
 * @class InternalController
 */
class InternalController {
    static init() {
        StreamerService.registerCallback(KEY, InternalController.update);
    }

    /**
     * Internal function to refresh all global markers in the streamer service.
     * Must abuse stringify, and parse to clear functions.
     * @static
     * @memberof InternalController
     */
    static refresh() {
        const polygons = [];

        Object.keys(globalPolygons).forEach((key) => {
            polygons.push(globalPolygons[key]);
        });

        StreamerService.updateData(KEY, JSON.parse(JSON.stringify(polygons)));
    }

    /**
     * Automatically passes through the closest polygons to a player.
     * It does not check if they are inside. Only gets polygons in the relative area.
     *
     * Create a Polygon from IStreamPolygon to check if they are inside.
     * @static
     * @param {alt.Player} player
     * @param {Array<IStreamPolygon>} polygons
     * @memberof InternalController
     */
    static update(player: alt.Player, polygons: Array<IStreamPolygon>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_POLYGONS, polygons);
    }

    /**
     * Handles relaying the polygon eventcalls for entering.
     * @static
     * @param {alt.Player} player
     * @param {IStreamPolygon} polygon
     * @memberof InternalController
     */
    static enter(player: alt.Player, polygonStream: IStreamPolygon) {
        const polygon = globalPolygons[polygonStream.uid];
        if (!polygon) {
            return;
        }

        if (!polygon.enterEventCall) {
            return;
        }

        polygon.enterEventCall(player, polygonStream);
    }

    /**
     * Handles relaying the polygon eventcalls for leaving.
     * @static
     * @param {alt.Player} player
     * @param {IStreamPolygon} polygonStream
     * @return {*}
     * @memberof InternalController
     */
    static leave(player: alt.Player, polygonStream: IStreamPolygon) {
        const polygon = globalPolygons[polygonStream.uid];
        if (!polygon) {
            return;
        }

        if (!polygon.leaveEventCall) {
            return;
        }

        polygon.leaveEventCall(player, polygonStream);
    }
}

export class ServerPolygonController {
    /**
     * Add or overwrite a global polygon stream.
     * @static
     * @param {IStreamPolygon} streamPolygon
     * @return {*}  {string}
     * @memberof ServerPolygonController
     */
    static append(streamPolygon: IStreamPolygon): string {
        if (!streamPolygon.uid) {
            streamPolygon.uid = sha256Random(JSON.stringify(streamPolygon));
        }

        globalPolygons[streamPolygon.uid] = streamPolygon;
        InternalController.refresh();
        return streamPolygon.uid;
    }

    /**
     * Remove a global polygon from streamer.
     * @static
     * @param {string} uid
     * @return {*}  {boolean}
     * @memberof ServerPolygonController
     */
    static remove(uid: string): boolean {
        if (globalPolygons[uid]) {
            delete globalPolygons[uid];
        }

        InternalController.refresh();
        return true;
    }
}

alt.onClient(SYSTEM_EVENTS.POLYGON_ENTER, InternalController.enter);
alt.onClient(SYSTEM_EVENTS.POLYGON_LEAVE, InternalController.leave);
InternalController.init();
