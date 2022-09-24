import * as alt from 'alt-client';
import * as natives from 'natives';

let FINGERPOINT_KEY = 66

export class Fingerpointing {

    active:boolean = false
    interval:number = null
    cleanStart:boolean = false
    debounceTime:number = 150
    lastBlockDate:number = null
    localPlayer = alt.Player.local

	registerEvents() {
		alt.on('keydown', (key) => {
			if (key !== FINGERPOINT_KEY) return;
			this.start();
		});

		alt.on('keyup', (key) => {
			if (key !== FINGERPOINT_KEY) return;
			this.stop();
		});
	}

	async start() {
		if (this.active) return;
		this.active = true;
		try {
			await this.requestAnimDictPromise('anim@mp_point');
			natives.setPedCurrentWeaponVisible(
				this.localPlayer.scriptID,
				false,
				true,
				true,
				true
			);
			natives.setPedConfigFlag(this.localPlayer.scriptID, 36, true);
			natives.taskMoveNetworkByName(
				this.localPlayer.scriptID,
				'task_mp_pointing',
				0.5,
				false,
				'anim@mp_point',
				24
			);
			this.cleanStart = true;
			this.interval = alt.setInterval(this.process.bind(this), 0);
		} catch (e) {
			alt.log(e);
		}
	}

	stop() {
		if (!this.active) return;
		if (this.interval) {
			alt.clearInterval(this.interval);
		}
		this.interval = null;

		this.active = false;

		if (!this.cleanStart) return;
		this.cleanStart = false;
		natives.requestTaskMoveNetworkStateTransition(
			this.localPlayer.scriptID,
			'Stop'
		);

		if (!natives.isPedInjured(this.localPlayer.scriptID)) {
			natives.clearPedSecondaryTask(this.localPlayer.scriptID);
		}
		if (!this.localPlayer.vehicle) {
			natives.setPedCurrentWeaponVisible(
				this.localPlayer.scriptID,
				true,
				true,
				true,
				true
			);
		}
		natives.setPedConfigFlag(this.localPlayer.scriptID, 36, false);
		natives.clearPedSecondaryTask(this.localPlayer.scriptID);
	}

	getRelativePitch() {
		let camRot = natives.getGameplayCamRot(2);
		return camRot.x - natives.getEntityPitch(this.localPlayer.scriptID);
	}

	process() {
		if (!this.active) return;
		let camPitch = this.getRelativePitch();
		if (camPitch < -70.0) {
			camPitch = -70.0;
		} else if (camPitch > 42.0) {
			camPitch = 42.0;
		}
		camPitch = (camPitch + 70.0) / 112.0;

		let camHeading = natives.getGameplayCamRelativeHeading();
		let cosCamHeading = Math.cos(camHeading);
		let sinCamHeading = Math.sin(camHeading);

		if (camHeading < -180.0) {
			camHeading = -180.0;
		} else if (camHeading > 180.0) {
			camHeading = 180.0;
		}
		camHeading = (camHeading + 180.0) / 360.0;

		let coords = natives.getOffsetFromEntityInWorldCoords(
			this.localPlayer.scriptID,
			cosCamHeading * -0.2 - sinCamHeading * (0.4 * camHeading + 0.3),
			sinCamHeading * -0.2 + cosCamHeading * (0.4 * camHeading + 0.3),
			0.6
		);
		let ray = natives.startShapeTestCapsule(
			coords.x,
			coords.y,
			coords.z - 0.2,
			coords.x,
			coords.y,
			coords.z + 0.2,
			1.0,
			95,
			this.localPlayer.scriptID,
			7
		);
		let [_, blocked, coords1, coords2, entity] = natives.getShapeTestResult(
			ray,
			false,
			null,
			null,
			null
		);
		if (blocked && this.lastBlockDate === null) {
			this.lastBlockDate = Date.now();
		}
		natives.setTaskMoveNetworkSignalFloat(
			this.localPlayer.scriptID,
			'Pitch',
			camPitch
		);
		natives.setTaskMoveNetworkSignalFloat(
			this.localPlayer.scriptID,
			'Heading',
			camHeading * -1.0 + 1.0
		);

		//this is a debounce for isBlocked network signal to avoid flickering of the peds arm on fast raycast changes
		if (this.isBlockingAllowed()) {
			natives.setTaskMoveNetworkSignalBool(
				this.localPlayer.scriptID,
				'isBlocked',
				blocked
			);
		}

		natives.setTaskMoveNetworkSignalBool(
			this.localPlayer.scriptID,
			'isFirstPerson',
			natives.getCamViewModeForContext(natives.getCamActiveViewModeContext()) === 4
		);
	}

	isBlockingAllowed() {
		const isAllowed = Date.now() - this.lastBlockDate > this.debounceTime;
		if (isAllowed) {
			this.lastBlockDate = null;
		}
		return isAllowed;
	}

	requestAnimDictPromise(dict) {
		natives.requestAnimDict(dict);
		return new Promise((resolve, reject) => {
			let tries = 0;
			let check = alt.setInterval(() => {
				tries++;
				if (natives.hasAnimDictLoaded(dict)) {
					alt.clearInterval(check);
					resolve(true);
				} else if (tries > 30) {
					alt.clearInterval(check);
					reject('Anim request wait limit reached');
				}
			}, 50);
		});
	}
}