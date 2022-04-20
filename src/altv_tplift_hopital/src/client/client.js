/**
 * @author Trackoad
 * @link https://gitlab.com/Trackoad
 */

import AltClient from 'alt-client';
import Game from 'natives';
import * as NativeUi from './lib/nativeui/nativeui.js';

/** @type {string} */
let key;

/** @type {number} */
let distanceRenderMarker = 30;

/** @type {Array<typeof import('../../config.example.json')['areas'][0]['marker'] & { id: string }>} */
let markers = [];

/** @type {string} */
let currentWaypoint = null;

const menuNativeUi = new NativeUi.Menu(`Lift`, `Melon`, new NativeUi.Point(50, 50));

/**
 * @param {AltClient.Vector3} distOne
 * @param {AltClient.Vector3} distTwo
 */
const distanceBetween = (distOne, distTwo) => {
	return Math.sqrt(Math.pow(distOne.x - distTwo.x, 2) + Math.pow(distOne.y - distTwo.y, 2) + Math.pow(distOne.z - distTwo.z, 2));
};

AltClient.onServer('waypoint::config', (keyConfig, distanceRenderMarkerConfig, markersConfig) => {
	key = keyConfig;
	markers = markersConfig;
	distanceRenderMarker = distanceRenderMarkerConfig;
});

AltClient.onServer('waypoint::list::leave', () => {
	currentWaypoint = null;
	if (menuNativeUi.Visible) {
		menuNativeUi.Visible = false;
	}
});

AltClient.onServer('waypoint::list::enter', (waypointsToTp, waypointIdToTp) => {
	if (!waypointsToTp || !waypointsToTp.length) {
		return;
	}
	currentWaypoint = waypointIdToTp;
	if (menuNativeUi.MenuItems.length) {
		menuNativeUi.RemoveItem(menuNativeUi.MenuItems[0]);
	}
	menuNativeUi.SubTitle = currentWaypoint;
	menuNativeUi.AddItem(new NativeUi.UIMenuListItem('Levels', '', new NativeUi.ItemsCollection(waypointsToTp)));
	menuNativeUi.ItemSelect.on(item => item.SelectedItem && AltClient.emitServer('waypoint::tp', item.SelectedItem.DisplayText));
	menuNativeUi.Visible = true;
});

AltClient.everyTick(() => {
	markers.forEach(marker => {
		if (distanceBetween(AltClient.Player.local.pos, marker.pos) < distanceRenderMarker) {
			Game.drawMarker(
				marker.type,
				marker.pos.x,
				marker.pos.y,
				marker.pos.z,
				0,
				0,
				0,
				0,
				0,
				0,
				marker.size.x || 1,
				marker.size.y || 1,
				marker.size.z || 1,
				marker.color.r,
				marker.color.g,
				marker.color.b,
				marker.id === currentWaypoint ? Number((255 * 0.6).toFixed()) : marker.color.a,
				false,
				false,
				2,
				false,
				undefined,
				undefined,
				false
			);
		}
	});
});