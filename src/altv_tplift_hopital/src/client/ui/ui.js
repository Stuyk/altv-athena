/**
 * @author Trackoad
 * @link https://gitlab.com/Trackoad
 */

if (!alt) {
	globalThis.alt = {
		emit: console.log,
		on: console.log,
	};
}

const getSelect = () => {
	return document.querySelector('select');
};

/**
 * @returns {HTMLButtonElement}
 */
const getButtonWaypoint = () => {
	return document.querySelector('#button-waypoint');
};

/**
 * @returns {HTMLButtonElement}
 */
const getButtonQuit = () => {
	return document.querySelector('#button-quit');
};

/**
 * @param {Array<string>} portals
 */
const setAllPortals = portals => {
	const selectElement = getSelect();
	document.querySelectorAll('select > option[value]').forEach(el => selectElement.removeChild(el));
	portals.forEach(portal => {
		const optionElement = document.createElement('option');
		optionElement.value = portal;
		optionElement.innerHTML = portal;
		selectElement.append(optionElement);
	});
	if (!getButtonWaypoint().onclick) {
		getButtonWaypoint().onclick = () => {
			const option = document.querySelectorAll('select > option[value]')[selectElement.selectedIndex - 1];
			if (option) {
				alt.emit('teleport::to', option.value);
			}
		};
	}
	if (!getButtonQuit().onclick) {
		getButtonQuit().onclick = () => {
			alt.emit('teleport::to');
		};
	}
};

alt.on('teleport::init', setAllPortals);
