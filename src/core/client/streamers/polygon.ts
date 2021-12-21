import * as alt from 'alt-client';
import * as native from 'natives';
import Polygon from '../../shared/classes/polygon';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { IStreamPolygon } from '../../shared/interfaces/iStreamPolygon';
import { findMissingElements } from '../../shared/utility/array';
import { distance2d } from '../../shared/utility/vector';
import { Timer } from '../utility/timers';

let addedPolygons: Array<Polygon> = [];
let isRemoving = false;
let interval: number;

/**
 * Do Not Export Internal Only
 */
class ClientPolygonController {
    static init() {
        addedPolygons = [];
    }

    static stop() {
        if (!interval) {
            return;
        }

        Timer.clearInterval(interval);
    }

    static populate(polygons: Array<IStreamPolygon>) {
        isRemoving = true;

        const newPolygons = [];

        // If no elements yet. Just construct the array and set it.
        if (addedPolygons.length <= 0) {
            for (let i = 0; i < polygons.length; i++) {
                const existsIndex = addedPolygons.findIndex((x) => x.streamPolygon.uid === polygons[i].uid);
                if (existsIndex >= 0) {
                    continue;
                }

                newPolygons.push(new Polygon(polygons[i]));
            }

            addedPolygons = newPolygons;
        } else {
            // Loop through added Polygons and determine what currently exists from new array.
            // However, if the new polygon array length is 0. We should just invoke a remove event.
            if (polygons.length <= 0) {
                for (let i = 0; i < addedPolygons.length; i++) {
                    addedPolygons[i].isEntityInPolygon<alt.Player>(
                        alt.Player.local,
                        ClientPolygonController.tryEnter,
                        ClientPolygonController.tryLeave,
                    );
                }

                addedPolygons = [];
                isRemoving = false;
                return;
            }

            // At this stage we should compare the two
            // and remove elements in the addedPolygons that do not exist in the new polygons.
            const removeFromAdded = findMissingElements<IStreamPolygon>(
                addedPolygons.map((x) => x.streamPolygon),
                polygons,
                'uid',
            );

            // Loop through the array backwards and remove all elements that no longer exist in the stream update.
            for (let i = addedPolygons.length - 1; i >= 0; i--) {
                const index = removeFromAdded.findIndex((x) => x.uid === addedPolygons[i].streamPolygon.uid);
                if (index <= -1) {
                    continue;
                }

                const oldPoly = addedPolygons.splice(i, 1);
                oldPoly[0].isEntityInPolygon<alt.Player>(
                    alt.Player.local,
                    ClientPolygonController.tryEnter,
                    ClientPolygonController.tryLeave,
                );
            }

            // We have now removed the OLD polygons. Now we must populate with
            // These should be considered new.
            // Check if the polygon uid already exists.
            // Then add the polygon if it does not exist.
            for (let i = 0; i < polygons.length; i++) {
                const index = addedPolygons.findIndex((x) => x.streamPolygon.uid === polygons[i].uid);
                if (index >= 0) {
                    continue;
                }

                newPolygons.push(new Polygon(polygons[i]));
            }

            addedPolygons = addedPolygons.concat(newPolygons);
        }

        isRemoving = false;

        if (!interval) {
            interval = Timer.createInterval(handleDrawPolygons, 0, 'polygon.ts');
        }
    }

    static tryEnter(streamPolygon: IStreamPolygon) {
        alt.emitServer(SYSTEM_EVENTS.POLYGON_ENTER, streamPolygon);
    }

    static tryLeave(streamPolygon: IStreamPolygon) {
        alt.emitServer(SYSTEM_EVENTS.POLYGON_LEAVE, streamPolygon);
    }
}

function handleDrawPolygons() {
    if (isRemoving) {
        return;
    }

    const polygons = [...addedPolygons];

    if (polygons.length <= 0) {
        return;
    }

    if (alt.Player.local.isWheelMenuOpen) {
        return;
    }

    if (alt.Player.local.isMenuOpen) {
        return;
    }

    if (alt.Player.local.meta.isDead) {
        return;
    }

    const insidePolygons: Array<Polygon> = [];

    for (let i = 0; i < polygons.length; i++) {
        const polygon = polygons[i];
        const center = polygon.getCenter();
        const dist = distance2d(alt.Player.local.pos, center);

        if (dist > polygon.streamPolygon.distance) {
            continue;
        }

        const isInside = polygon.isEntityInPolygon<alt.Player>(
            alt.Player.local,
            ClientPolygonController.tryEnter,
            ClientPolygonController.tryLeave,
        );

        if (isInside) {
            insidePolygons.push(polygon);
        }

        // Debug Information
        if (polygon.streamPolygon.debug) {
            const color = isInside ? new alt.RGBA(0, 255, 0, 255) : new alt.RGBA(255, 0, 0, 255);
            const lines = polygon.getDrawLines();
            const maxYPos = polygon.getMaxY();
            for (let i = 0; i < lines.length; i++) {
                const a = lines[i].a;
                const b = lines[i].b;
                native.drawLine(a.x, a.y, a.z, b.x, b.y, b.z, color.r, color.g, color.b, color.a);
                native.drawLine(a.x, a.y, a.z, a.x, a.y, maxYPos.z, color.r, color.g, color.b, color.a);
                native.drawLine(a.x, a.y, maxYPos.z, b.x, b.y, maxYPos.z, color.r, color.g, color.b, color.a);
            }
        }
    }
}

alt.on('connectionComplete', ClientPolygonController.init);
alt.on('disconnect', ClientPolygonController.stop);
alt.onServer(SYSTEM_EVENTS.POPULATE_POLYGONS, ClientPolygonController.populate);
