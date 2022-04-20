$(() => {
	// #region CONFIG
	let isCharging = false;
	let isFlightMode = false;
	let audioVolume = 0.25;

	let audioCharge = new Audio('./audio/charge.mp3');
	audioCharge.volume = audioVolume;
	let audioClick = new Audio('./audio/click.mp3');
	audioClick.volume = audioVolume;

	let noSound = ['appChargeButton', 'appWeatherButton', 'appCalenderButton'];
	let noAppScreen = [
		'appChargeButton',
		'appAirplaneButton',
		'appWeatherButton',
		'appCalenderButton'
	];
	// #endregion

	// #region EVENTS
	if ('alt' in window) {
		alt.emit('smartphone:ready');

		alt.on('smartphone:update', (data) => {
			updateSmartphone(data);
		});
		alt.on('smartphone:contacts:receive', (data) => {
			receiveContacts(data);
		});
		alt.on('smartphone:hide', () => {
			$('#smartphone').animate({ bottom: '-29vw', opacity: '0.5' }, 250);
		});
		alt.on('smartphone:show', () => {
			$('#smartphone').animate({ bottom: '2vw', opacity: '1' }, 250);
		});
	}
	// #endregion

	// #region general
	function updateSmartphone(data) {
		let batteryIcon = 'battery-empty';
		if (data.batteryPercent >= 25) batteryIcon = 'battery-quarter';
		if (data.batteryPercent >= 50) batteryIcon = 'battery-half';
		if (data.batteryPercent >= 75) batteryIcon = 'battery-three-quarters';
		if (data.batteryPercent >= 90) batteryIcon = 'battery-full';
		$('#battery')
			.removeClass()
			.addClass('fas fa-' + batteryIcon);

		$('#clock').text(data.currentTime);

		$('#appWeatherButton > i')
			.removeClass()
			.addClass('fas fa-' + data.weather);

		$('#appCalenderButton').text(data.date);
	}

	function toggleHomeScreen(screen = null) {
		if ($('#homeScreen').is(':visible')) {
			$('#homeScreen').hide();
			$('#appScreen').show();
			$('#appScreen > div').hide();
			$('#homeButton').show();
			if (screen)
				$((showScreen = '#' + screen.replace('Button', ''))).show();
		} else {
			$('#homeScreen').show();
			$('#appScreen').hide();
			$('#homeButton').hide();
		}
	}

	$('#appChargeButton').click(() => {
		audioCharge.play();
		if (isCharging) {
			isCharging = false;
			$('#battery').css('color', '#FFF');
		} else {
			isCharging = true;
			$('#battery').css('color', 'rgb(110, 255, 128)');
		}
		if ('alt' in window) alt.emit('smartphone:charge', isCharging);
	});

	$('#appAirplaneButton').click(() => {
		if (isFlightMode) {
			isFlightMode = false;
			$('#signal')
				.removeClass('fa-plane')
				.addClass('fa-signal');
		} else {
			isFlightMode = true;
			$('#signal')
				.removeClass('fa-signal')
				.addClass('fa-plane');
		}
		if ('alt' in window) alt.emit('smartphone:flightmode', isFlightMode);
	});

	$('#homeButton').click(() => {
		audioClick.play();
		toggleHomeScreen();
	});

	$('.app').click(function() {
		if (!noSound.includes($(this).attr('id'))) audioClick.play();
		if (!noAppScreen.includes($(this).attr('id')))
			toggleHomeScreen($(this).attr('id'));
	});
	// #endregion

	// #region CONTACTS
	$('#appContactsSearch').on('keyup change', function() {
		let searchString = $(this)
			.val()
			.toLowerCase();
		if (searchString.length) {
			$('.contact').hide();
			$('.contact').each(function() {
				if (
					$(this)
						.text()
						.toLowerCase()
						.includes(searchString)
				)
					$(this).show();
			});
		} else {
			$('.contact').show();
		}
	});

	$('#appContactsButton').click(() => {
		if ('alt' in window) alt.emit('smartphone:contacts:request');
		$('#appContactsOverview').show();
	});

	$('#contactNewName').on('change, keyup', () => {
		sendUpdateContact();
	});

	$('#contactNewPhone').on('change, keyup', () => {
		sendUpdateContact();
	});

	$(document).on('click', '.contact', function() {
		showEditContact(
			$(this).attr('data-id'),
			$(this).attr('data-name'),
			$(this).attr('data-phone')
		);
	});

	$('#editContactHead').click(() => {
		hideEditContact();
	});

	$('#editContactDeleteButton').click(() => {
		let deleteId = $('#contactId').val();
		if ('alt' in window) alt.emit('smartphone:contacts:delete', deleteId);
		hideEditContact();
	});

	function showEditContact(id, name, phone) {
		$('#contactId').val(id);
		$('#contactNewName').val(name);
		$('#editContactName').text(name);
		$('#editContactLetter > span').text(name[0]);
		$('#contactNewPhone').val(phone);
		$('#appContactsOverview').hide();
		$('#appContactsEdit').show();
	}

	function hideEditContact() {
		$('#contactId').val('');
		$('#contactNewName').val('');
		$('#contactNewPhone').val('');
		$('#appContactsOverview').show();
		$('#appContactsEdit').hide();
		$('#appContactsSearch').val('');
		$('.contact').show();
	}

	function sendUpdateContact() {
		let contactId = $('#contactId').val();
		let contactName = $('#contactNewName').val();
		let contactPhone = $('#contactNewPhone').val();

		let newData = { id: contactId, name: contactName, phone: contactPhone };
		if (contactId && contactName && contactPhone) {
			if ('alt' in window)
				alt.emit('smartphone:contacts:update', newData);
			$('#editContactName').text(contactName);
		}
	}

	function receiveContacts(data) {
		if ($('#appContacts').length) {
			$('#appContactsList').html('');
			let newHTML = '';
			data.forEach((d) => {
				newHTML += `
				<div class="contact" data-id="${d.id}" data-name="${d.name}" data-phone="${d.phone}">
					${d.name}
				</div>`;
			});
			$('#appContactsList').html(newHTML);
		}
	}
	// #endregion
});
