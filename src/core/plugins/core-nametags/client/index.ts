import * as alt from 'alt-client';
import * as native from 'natives';
import { Timer } from '../../../client/utility/timers';
import { PLAYER_SYNCED_META } from '../../../shared/enums/playerSynced';
import { distance2d } from '../../../shared/utility/vector';
import { NAMETAG_EVENTS } from '../shared/enums';
import { INametagConfig } from '../shared/interfaces';

let showNametags = true;
let config: INametagConfig;
let interval: number;

class ClientNametags {
    /**
     * Initialize the Nametag Configuration, and Render Nametags
     * @static
     * @param {INametagConfig} _config
     * @memberof ClientNametags
     */
    static init(_config: INametagConfig) {
        interval = Timer.createInterval(ClientNametags.render, 0, 'nametag.ts');
        config = _config;

        if (config.SHOW_NAMETAGS_WITH_KEY) {
            alt.on('keydown', ClientNametags.keyDown);
            alt.on('keyup', ClientNametags.keyUp);
            showNametags = false;
        }
    }

    static keyUp(key: number) {
        if (key !== config.NAME_TAGS_KEY) {
            return;
        }

        showNametags = false;
    }

    static keyDown(key: number) {
        if (key !== config.NAME_TAGS_KEY) {
            return;
        }

        showNametags = true;
    }

    /**
     * Render nametags from a timer.
     * @static
     * @memberof ClientNametags
     */
    static render() {
        native.drawRect(0, 0, 0, 0, 0, 0, 0, 0, false); // Used to fix a draw error.

        if (alt.Player.local.isMenuOpen) {
            return;
        }

        if (!showNametags) {
            return;
        }

        if (config.SHOULD_SCREEN_SHAKE && !native.isPedRagdoll(alt.Player.local.scriptID)) {
            if (alt.Player.local.isAiming) {
                if (!native.isGameplayCamShaking()) {
                    native.shakeGameplayCam('HAND_SHAKE', 3);
                }
            } else {
                if (native.isGameplayCamShaking()) {
                    native.stopGameplayCamShaking(true);
                }
            }
        }

        for (let i = 0, n = alt.Player.all.length; i < n; i++) {
            let player = alt.Player.all[i];
            if (!player.valid) {
                continue;
            }

            if (player.getSyncedMeta('NoClipping')) {
                continue;
            }

            if (player.vehicle && alt.Player.local.vehicle !== player.vehicle) {
                continue;
            }

            if (player.scriptID === alt.Player.local.scriptID) {
                continue;
            }

            let playerIdentifier = player.getSyncedMeta(PLAYER_SYNCED_META.IDENTIFICATION_ID);
            let name = player.getSyncedMeta(PLAYER_SYNCED_META.NAME) as string;

            if (!name || name === null || name === undefined) {
                continue;
            }

            name = name.replace('_', ' ');

            if (!name) {
                continue;
            }

            if (!native.hasEntityClearLosToEntity(alt.Player.local.scriptID, player.scriptID, 17)) {
                continue;
            }

            let dist = distance2d(player.pos, alt.Player.local.pos);
            if (dist > config.MAX_DRAW_DISTANCE) {
                player.inVisionTime = null;
                continue;
            }

            if (!config.SHOW_NAME_INSTANTLY) {
                if (player.inVisionTime === null || (player.inVisionTime === undefined && isNaN(player.inVisionTime))) {
                    player.inVisionTime = Date.now() + 5000;
                }

                if (Date.now() < player.inVisionTime) {
                    name = '';
                }
            }

            const pos = { ...native.getPedBoneCoords(player.scriptID, 12844, 0, 0, 0) };
            pos.z += 0.75;

            let scale = 1 - (0.8 * dist) / config.MAX_DRAW_DISTANCE;
            let fontSize = 0.6 * scale;

            const entity = player.vehicle ? player.vehicle.scriptID : player.scriptID;
            const vector = native.getEntityVelocity(entity);
            const frameTime = native.getFrameTime();

            // Names
            native.setDrawOrigin(
                pos.x + vector.x * frameTime,
                pos.y + vector.y * frameTime,
                pos.z + vector.z * frameTime,
                0,
            );

            let actualName = config.SHOW_ID ? `${playerIdentifier}` : ``;

            if (name !== '') {
                actualName += config.SHOW_NAME ? ` - ${name}` : ``;
            }

            native.beginTextCommandDisplayText('STRING');
            native.setTextFont(4);
            native.setTextScale(fontSize, fontSize);
            native.setTextProportional(true);
            native.setTextCentre(true);
            native.setTextColour(255, 255, 255, 255);
            native.setTextOutline();
            native.addTextComponentSubstringPlayerName(actualName);
            native.endTextCommandDisplayText(0, 0, 0);
            native.clearDrawOrigin();
        }
    }
}

alt.onServer(NAMETAG_EVENTS.CONFIG, ClientNametags.init);
