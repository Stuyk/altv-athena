/**
 * @author Trackoad
 * @link https://gitlab.com/Trackoad
 */

import Config from '../config.json';
import AltServer from 'alt-server';

/** @type {Map<string, Array<typeof Config['areas'][0]>>} */
const waypointsTo = new Map();

/** @type {Map<string, AltServer.ColshapeSphere>} */
const colshapes = new Map();

const withMarker = [];

Config.areas.forEach(area => {
	const colshape = new AltServer.ColshapeSphere(area.marker.pos.x, area.marker.pos.y, area.marker.pos.z, area.marker.size.x);
	colshape.dimension = Config.dimension || 0;
	colshape.waypoint = area.id;
	colshapes.set(area.id, area.spawn);
	(area.canGoTo || []).forEach(areaGoTo => {
		if (!waypointsTo.has(area.id)) {
			waypointsTo.set(area.id, []);
		}
		waypointsTo.get(area.id).push(areaGoTo);
	});
});
waypointsTo.forEach((_, id) => withMarker.push(id));

AltServer.on('playerConnect', player => {
	if (Config.debug) {
		player.pos = Config.areas[0].marker.pos;
		player.model = 'ig_drfriedlander';
	}
	AltServer.emitClient(player, 'waypoint::config', Config.key, Config.distanceRenderMarker, Config.areas.filter(area => withMarker.includes(area.id)).map(area => ({ ...area.marker, id: area.id })));
})

AltServer.on('entityEnterColshape', (colshape, player) => player instanceof AltServer.Player &&
	AltServer.emitClient(player, 'waypoint::list::enter', waypointsTo.get(colshape.waypoint), colshape.waypoint));

AltServer.on('entityLeaveColshape', (_, player) => player instanceof AltServer.Player && AltServer.emitClient(player, 'waypoint::list::leave'));

AltServer.onClient('waypoint::tp', (player, colshapeId) => {
	player.pos = colshapes.get(colshapeId);
});