/**
 * Preface:
 *
 * The purpose of this code is to allow any type of...
 * rmlui based text rendering that can replace the `drawText2D`.
 *
 * Meaning it needs to function in a similar way as drawText2D.
 *
 * Goals:
 * - Every render tick it will auto-position / render the text
 * - Positions based on 3D position to 2D screen conversion
 * - Scales text based on distance with font-size
 * - Performant, because it uses render tick instead of adding to a big list
 * - Icons with font-awesome
 **/

import alt, { RmlElement } from 'alt-client';
import * as native from 'natives';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Vector2, Vector3 } from '../../shared/interfaces/vector';
import { distance, distance2d } from '../../shared/utility/vector';
import { isAnyMenuOpen } from '../utility/menus';
import { UID } from '../utility/uid';

const elements: {
    [uid: string]: { element: RmlElement; position: Vector2 | Vector3; nextCheck?: number; isOffScreen?: boolean };
} = {};

const fontsToLoad = [
    {
        path: '/client/rmlui/fonts/arialbd.ttf', // Only supports TTF
        name: 'arial',
        italic: false,
        bold: false,
    },
];

let document: alt.RmlDocument;
let container: alt.RmlElement;
let nextcheck = Date.now() + 2000;

class InternalFunctions {
    static init() {
        for (let i = 0; i < fontsToLoad.length; i++) {
            if (!fontsToLoad[i].path.includes('ttf')) {
                console.warn(`Could not load Font: ${fontsToLoad[i].path}. TTF only fonts.`);
                continue;
            }

            alt.loadRmlFont(fontsToLoad[i].path, fontsToLoad[i].name, fontsToLoad[i].italic, fontsToLoad[i].bold);
        }

        document = new alt.RmlDocument('/client/rmlui/screenText.rml');
        container = document.getElementByID('container');
        document.show();
        alt.setInterval(InternalFunctions.update, 0);
    }

    static update() {
        if (isAnyMenuOpen(true)) {
            document.hide();
            return;
        }

        const currentDraws = Object.keys(elements).map((key) => {
            return { key, ...elements[key] };
        });

        const camPos = alt.getCamPos();
        for (let i = 0; i < currentDraws.length; i++) {
            const textDraw = currentDraws[i];
            let screenPosition: Vector2;
            let fontSize = '70dp';

            // Convert Vector3 to screen position if necessary
            if (textDraw.position.hasOwnProperty('z')) {
                const vectorPos = textDraw.position as Vector3;

                screenPosition = alt.worldToScreen(vectorPos.x, vectorPos.y, vectorPos.z);
                // const isOnScreen = native.isSphereVisible(vectorPos.x, vectorPos.y, vectorPos.z, 0.0099999998);

                // // Check if on-screen
                // if (!isOnScreen) {
                //     if (!textDraw.element.hasClass('hide')) {
                //         textDraw.element.addClass('hide');
                //     }
                // } else {
                //     if (textDraw.element.hasClass('hide')) {
                //         textDraw.element.removeClass('hide');
                //     }
                // }

                // const [onScreen, _x, _y] = native.getScreenCoordFromWorldCoord()

                const dist = distance(camPos, vectorPos);
                let scale = 2 * dist;
                if (scale > 20) {
                    scale = 20;
                }

                if (scale < 12) {
                    scale = 12;
                }

                fontSize = `${scale}dp`;
            } else {
                screenPosition = textDraw.position;
            }

            const leftModification = textDraw.element.clientWidth / 2;

            textDraw.element.setProperty('left', `${screenPosition.x - leftModification}px`);
            textDraw.element.setProperty('top', `${screenPosition.y}px`);
            textDraw.element.setProperty('font-size', fontSize);
            // textDraw.element.setProperty('text-shadow', '0px 1px 2px black');
        }
    }
}

export class ScreenText {
    static addText(text: string, position: Vector2 | Vector3, uid: string = null): string {
        if (!uid) {
            uid = UID.generate();
        }

        if (elements[uid]) {
            ScreenText.removeText(uid);
        }

        elements[uid] = {
            element: document.createElement('div'),
            position,
        };

        elements[uid].element.addClass('text');
        elements[uid].element.innerRML = text;
        elements[uid].element.setProperty('left', `${position.x}px`);
        elements[uid].element.setProperty('top', `${position.y}px`);
        elements[uid].element.setProperty('font-size', '70dp');
        container.appendChild(elements[uid].element);

        return uid;
    }

    static updateText(uid: string, position: Vector2 | Vector3) {
        if (!elements[uid]) {
            return;
        }

        elements[uid].position = position;
    }

    static hasText(uid: string) {
        if (!elements[uid]) {
            return false;
        }

        return true;
    }

    static removeText(uid: string) {
        const elementRef = elements[uid];
        if (!elementRef) {
            return;
        }

        const element = elementRef.element;

        try {
            container.removeChild(element);
            delete elements[uid];
        } catch (err) {}
    }
}

alt.onServer(SYSTEM_EVENTS.TICKS_START, InternalFunctions.init);

// alt.onServer(SYSTEM_EVENTS.TICKS_START, () => {
//     alt.log('starting...');
//     alt.everyTick(() => {
//         // if (!ScreenText.hasText(`player-${alt.Player.local.id}`)) {
//         //     ScreenText.addText(`${alt.Player.local.name}`, alt.Player.local.pos, `player-${alt.Player.local.id}`);
//         // }
//         // ScreenText.updateText(
//         //     `player-${alt.Player.local.id}`,
//         //     new alt.Vector3(alt.Player.local.pos.x, alt.Player.local.pos.y, alt.Player.local.pos.z + 1),
//         // );
//         alt.Vehicle.all.forEach((vehicle) => {
//             if (!vehicle || !vehicle.valid) {
//                 return;
//             }
//             let isOnScreen = true; //native.isSphereVisible(vehicle.pos.x, vehicle.pos.y, vehicle.pos.z, 0.0099999998);
//             const dist = distance2d(vehicle.pos, alt.Player.local.pos);
//             if (dist > 25) {
//                 isOnScreen = false;
//             }
//             if (!isOnScreen) {
//                 if (ScreenText.hasText(`vehicle-${vehicle.id}`)) {
//                     ScreenText.removeText(`vehicle-${vehicle.id}`);
//                 }
//                 return;
//             }
//             if (!ScreenText.hasText(`vehicle-${vehicle.id}`)) {
//                 ScreenText.addText(`(${vehicle.id})`, vehicle.pos, `vehicle-${vehicle.id}`);
//             }
//             ScreenText.updateText(
//                 `vehicle-${vehicle.id}`,
//                 new alt.Vector3(vehicle.pos.x, vehicle.pos.y, vehicle.pos.z),
//             );
//         });
//     });
// });
