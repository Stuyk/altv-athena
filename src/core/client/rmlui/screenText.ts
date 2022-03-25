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
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Vector2, Vector3 } from '../../shared/interfaces/vector';
import { distance2d } from '../../shared/utility/vector';
import { isAnyMenuOpen } from '../utility/menus';
import { UID } from '../utility/uid';

const elements: { [uid: string]: { element: RmlElement; position: Vector2 | Vector3 } } = {};
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

        for (let i = 0; i < currentDraws.length; i++) {
            const textDraw = currentDraws[i];
            let screenPosition: Vector2;

            // Convert Vector3 to screen position if necessary
            if (textDraw.position.hasOwnProperty('z')) {
                const vectorPos = textDraw.position as Vector3;
                screenPosition = alt.worldToScreen(vectorPos.x, vectorPos.y, vectorPos.z);
            } else {
                screenPosition = textDraw.position;
            }

            textDraw.element.setProperty('left', `${screenPosition.x}px`);
            textDraw.element.setProperty('top', `${screenPosition.y}px`);
            textDraw.element.setProperty('font-size', '70dp');
            // Add Text Scaling Here...
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
        elements[text].element.addClass('text');
        elements[text].element.innerRML = text;
        elements[text].element.setProperty('left', `${position.x}px`);
        elements[text].element.setProperty('top', `${position.y}px`);
        elements[text].element.setProperty('font-size', '70dp');
        container.appendChild(elements[text].element);

        return uid;
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

alt.on(SYSTEM_EVENTS.TICKS_START, InternalFunctions.init);
