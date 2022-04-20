import * as alt from 'alt';

alt.on('keydown', (key) => {
	if (key === 33) toggleSmartphone();
});

let webView = null;
let isVisible = false;

let contacts = [
	{ id: 1, name: 'Abbigail Mccabe', phone: '9300' },
	{ id: 2, name: 'Brody Kaufman', phone: '9301' },
	{ id: 3, name: 'Charlie Elliott', phone: '9302' },
	{ id: 4, name: 'Eilish Maddox', phone: '9303' },
	{ id: 5, name: 'Elliott Morales', phone: '9304' },
	{ id: 6, name: 'Elwood Valencia', phone: '9305' },
	{ id: 7, name: 'Fynley Bowers', phone: '9306' },
	{ id: 8, name: 'Kingston Farrell', phone: '9307' },
	{ id: 9, name: 'Kylie Edge', phone: '9308' },
	{ id: 10, name: 'Lorelai Harmon', phone: '9309' },
	{ id: 11, name: 'Marjorie Rayner', phone: '9310' },
	{ id: 12, name: 'Owain Mathis', phone: '9311' },
	{ id: 13, name: 'Peyton Harmon', phone: '9312' },
	{ id: 14, name: 'Rami Franks', phone: '9313' },
	{ id: 15, name: 'Reon Bean', phone: '9314' },
	{ id: 16, name: 'Samara Wise', phone: '9315' },
	{ id: 17, name: 'Simran Kirkland', phone: '9316' },
	{ id: 18, name: 'Teri Berger', phone: '9317' },
	{ id: 19, name: 'Tj Howell', phone: '9318' },
	{ id: 20, name: 'Uzair Warner', phone: '9319' }
];

if (!webView) {
	webView = new alt.WebView('http://resource/client/html/smartphone.html');

	webView.on('smartphone:contacts:update', (newData) => {
		updateContact(newData);
	});

	webView.on('smartphone:ready', () => {
		updateData();
		sendContacts();
	});

	webView.on('smartphone:contacts:request', () => {
		sendContacts();
	});

	webView.on('smartphone:contacts:delete', (deleteId) => {
		deleteContact(deleteId);
	});

	webView.on('smartphone:charge', (isCharging) => {
		// do something here
	});

	webView.on('smartphone:flightmode', (isFlightMode) => {
		// do something here
	});
}

function toggleSmartphone() {
	if (!isVisible) {
		webView.emit('smartphone:show');
		alt.toggleGameControls(false);
		alt.showCursor(true);
		isVisible = true;
		webView.focus();
	} else {
		webView.emit('smartphone:hide');
		alt.toggleGameControls(true);
		alt.showCursor(false);
		isVisible = false;
		webView.unfocus();
	}
}

function updateContact(newData) {
	const found = contacts.find((e) => e.id === parseInt(newData.id));
	if (found) {
		found.name = newData.name;
		found.phone = newData.phone;
		sendContacts();
	}
}

function deleteContact(deleteId) {
	const found = contacts.find((e) => e.id === parseInt(deleteId));
	if (found) {
		contacts.splice(contacts.indexOf(found), 1);
		sendContacts();
	}
}

function updateData() {
	let smartphoneData = {
		batteryPercent: 88,
		currentTime: '10:56',
		weather: 'sun', // wind, smog, cloud, sun, cloud-sun-rain, cloud-sun, cloud-showers-heavy, cloud-rain, snowflake
		date: 30
	};
	webView.emit('smartphone:update', smartphoneData);

	alt.setTimeout(() => {
		updateData();
	}, 5000);
}

function sendContacts() {
	webView.emit('smartphone:contacts:receive', contacts);
}
