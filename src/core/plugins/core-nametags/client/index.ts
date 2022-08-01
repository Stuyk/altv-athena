import * as alt from 'alt-client';
import * as native from 'natives';
import { PLAYER_SYNCED_META } from '../../../shared/enums/playerSynced';
import { distance2d } from '../../../shared/utility/vector';
import { NAMETAG_EVENTS } from '../shared/enums';
import { INametagConfig } from '../shared/interfaces';

let showNametags = true;
let config: INametagConfig;
let interval: number;
let document: alt.RmlDocument;
let container: alt.RmlElement;
let all: Array<INametag> = [];

// Nametag interface
interface INametag {
    player: alt.Player;
    elements: { name: alt.RmlElement };
}


class ClientNametags {
    /**
     * Initialize the Nametag Configuration, and Render Nametags
     * @static
     * @param {INametagConfig} _config
     * @memberof ClientNametags
     */
    static init(_config: INametagConfig) {
        alt.loadRmlFont('../../../client/rmlui/fonts/arialbd.ttf', 'arial', false, true);
        interval = alt.everyTick(ClientNametags.render);
        alt.on('gameEntityCreate', ClientNametags.create);
        alt.on('gameEntityDestroy', ClientNametags.delete);
        config = _config;

        document = new alt.RmlDocument(
            './src/nametags.rml'
        );
        document.show();
        container = document.getElementByID('nametags');

        if (config.SHOW_NAMETAGS_WITH_KEY) {
            alt.on('keydown', ClientNametags.keyDown);
            alt.on('keyup', ClientNametags.keyUp);
            showNametags = false;
        }
        ClientNametags.create(alt.Player.local)
    }

    /**
     * Create a nametag for a player
     * @param entity Player to create a nametag for
     */
    static create(entity: alt.Entity) {
        if (entity instanceof alt.Player) {
            // Create name element
            const name: alt.RmlElement = document.createElement('div');
            name.addClass('name');

            // Append RmlElement(s) to the container
            container.appendChild(name);

            // Push nametags to array
            all.push({
                player: entity,
                elements: { name },
            });
        }
    }

    /**
     * Delete a player's nametag
     * @param entity Player to delete nametag for
     */
    static delete(entity: alt.Entity) {
        if (entity instanceof alt.Player) {
            // Find the nametag for the specified player
            const nametag = all.find(
                (nametag) => nametag.player === entity
            );

            if (nametag) {
                // Delete elements
                Object.entries(nametag.elements).forEach(([_, element]) =>
                    container.removeChild(element)
                );

                // Update array
                all = all.filter(
                    (nametag) => nametag.player !== entity
                );
            }
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

        if (config.SHOULD_SCREEN_SHAKE) {
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



        for (let nametag of all) {
            let playerIdentifier = nametag.player.getSyncedMeta(PLAYER_SYNCED_META.IDENTIFICATION_ID);
            let name = nametag.player.getSyncedMeta(PLAYER_SYNCED_META.NAME) as string;

            if (!name || name === null || name === undefined) {
                continue;
            }

            name = name.replace('_', ' ');

            if (!name) {
                continue;
            }


            // Get the coords of the player's head bone
            const { x, y, z } = native.getPedBoneCoords(
                nametag.player,
                12844,
                0,
                0,
                0
            );

            //const onScreen = alt.isPointOnScreen(x, y, z);
            const lineOfSight = native.hasEntityClearLosToEntity(
                alt.Player.local,
                nametag.player,
                17
            );
            const dist = nametag.player.pos.distanceTo(alt.Player.local.pos);
            const distance =
                dist < config.MAX_DRAW_DISTANCE;

            let scale = 36 - (0.8 * dist) / config.MAX_DRAW_DISTANCE;
            let fontSize = 0.6 * scale;
            const inVehicle = nametag.player.vehicle !== null;

            // Run checks before drawing the nametag
            if (/*onScreen &&*/ lineOfSight && distance && !inVehicle) {
                let nametagString: string = config.SHOW_ID ? `${playerIdentifier}` : ``;

                if (name !== '') {
                    nametagString += config.SHOW_NAME ? ` - ${name}` : ``;
                }

                // Get the screen position of the player's head bone
                const screen = alt.worldToScreen(x, y, z + 0.35);

                // Set nametag color to orange when player is typing
                nametag.player.getStreamSyncedMeta('isTyping')
                    ? nametag.elements.name.addClass('typing')
                    : nametag.elements.name.removeClass('typing');

                // Set nametag color to red if player is dead
                nametag.player.meta.isDead
                    ? nametag.elements.name.addClass('dead')
                    : nametag.elements.name.removeClass('dead');

                let dist = distance2d(nametag.player.pos, alt.Player.local.pos);
                if (dist > config.MAX_DRAW_DISTANCE) {
                    nametag.player.inVisionTime = null;
                    continue;
                }

                if (!config.SHOW_NAME_INSTANTLY) {
                    if (nametag.player.inVisionTime === null || (nametag.player.inVisionTime === undefined && isNaN(nametag.player.inVisionTime))) {
                        nametag.player.inVisionTime = Date.now() + 5000;
                    }

                    if (Date.now() < nametag.player.inVisionTime) {
                        name = '';
                    }
                }

                // Set nametag position
                nametag.elements.name.removeClass('hide');
                nametag.elements.name.setProperty('top', `${screen.y}px`);
                nametag.elements.name.setProperty(
                    'left',
                    `${screen.x - nametag.elements.name.offsetWidth / 2}px`
                );
                nametag.elements.name.setProperty('font-size', `${fontSize}dp`)

                // Set the nametag text
                nametag.elements.name.innerRML = nametagString;
            } else {
                // Hide nametag
                Object.entries(nametag.elements).forEach(([_, element]) =>
                    element.addClass('hide')
                );
            }
        }
    }
}

alt.onServer(NAMETAG_EVENTS.CONFIG, ClientNametags.init);
