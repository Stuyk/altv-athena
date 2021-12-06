import * as alt from 'alt-server';
import { SYSTEM_EVENTS } from '../../shared/enums/System';
import { sha256Random } from '../utility/encryption';
import { StreamerService } from '../systems/streamer';
import { IStreamPolygon } from '../../shared/interfaces/IStreamPolygon';

const KEY = 'polygons';
const globalPolygons: Array<IStreamPolygon> = [];

export class ServerPolygonController {
    static init() {
        StreamerService.registerCallback(KEY, ServerPolygonController.update);
    }

    /**
     * Internal function to refresh all global markers in the streamer service.
     * @static
     * @memberof ServerPolygonController
     */
    static refresh() {
        StreamerService.updateData(KEY, globalPolygons);
    }

    static append(streamPolygon: IStreamPolygon): string {
        if (!streamPolygon.uid) {
            streamPolygon.uid = sha256Random(JSON.stringify(streamPolygon));
        }

        globalPolygons.push(streamPolygon);
        ServerPolygonController.refresh();
        return streamPolygon.uid;
    }

    static remove(uid: string): boolean {
        const index = globalPolygons.findIndex((label) => label.uid === uid);
        if (index <= -1) {
            return false;
        }

        globalPolygons.splice(index, 1);
        ServerPolygonController.refresh();
        return true;
    }

    static removeFromPlayer(player: alt.Player, uid: string) {
        if (!uid) {
            throw new Error(`Did not specify a uid for polygon removal. ServerPolygonController.removeFromPlayer`);
        }

        alt.emitClient(player, SYSTEM_EVENTS.REMOVE_POLYGON, uid);
    }

    /**
     * Add a marker to a single local player.
     * @static
     * @param {alt.Player} player
     * @param {IStreamPolygon} streamPolygon
     * @returns {string} uid for polygon
     * @memberof ServerPolygonController
     */
    static addToPlayer(player: alt.Player, streamPolygon: IStreamPolygon): string {
        if (!streamPolygon.uid) {
            streamPolygon.uid = sha256Random(JSON.stringify(streamPolygon));
        }

        alt.emitClient(player, SYSTEM_EVENTS.APPEND_POLYGON, streamPolygon);
        return streamPolygon.uid;
    }

    /**
     * Automatically passes through the closest polygons to a player.
     * It does not check if they are inside. Only gets polygons in the relative area.
     *
     * Create a Polygon from IStreamPolygon to check if they are inside.
     * @static
     * @param {alt.Player} player
     * @param {Array<IStreamPolygon>} polygons
     * @memberof ServerPolygonController
     */
    static update(player: alt.Player, polygons: Array<IStreamPolygon>) {
        alt.emitClient(player, SYSTEM_EVENTS.POPULATE_POLYGONS, polygons);
    }
}

ServerPolygonController.init();
