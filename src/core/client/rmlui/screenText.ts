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
import { Vector2, Vector3 } from '../../shared/interfaces/vector';
import { distance2d } from '../../shared/utility/vector';

const elements: { [key: string]: { element: RmlElement; timeout?: number } } = {};
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
    }

    static removeElement(text: string) {
        const elementRef = elements[text];
        if (!elementRef) {
            return;
        }

        const element = elementRef.element;

        try {
            console.log(text);

            container.removeChild(element);
            console.log('removed element');
            delete elements[text];
            console.log('removed ref');
        } catch (err) {}
    }
}

export class ScreenText {
    static draw3D(text: string, position: Vector3) {
        const screen = alt.worldToScreen(position.x, position.y, position.z);
        ScreenText.draw2D(text, new alt.Vector2(screen.x, screen.y));
    }

    static draw2D(text: string, position: Vector2) {
        if (!elements[text]) {
            elements[text] = {
                element: document.createElement('div'),
                timeout: alt.setTimeout(() => {
                    InternalFunctions.removeElement(text);
                }, 500),
            };
            elements[text].element.addClass('text');
            elements[text].element.innerRML = text;
            elements[text].element.setProperty('left', `${position.x}px`);
            elements[text].element.setProperty('top', `${position.y}px`);
            elements[text].element.setProperty('font-size', '70dp');
            container.appendChild(elements[text].element);
        } else {
            const elementRef = elements[text];
            if (!elementRef) {
                return;
            }

            alt.clearTimeout(elementRef.timeout);
            elementRef.element.setProperty('left', `${position.x}px`);
            elementRef.element.setProperty('top', `${position.y}px`);
            elementRef.timeout = alt.setTimeout(() => {
                InternalFunctions.removeElement(text);
            }, 500);
        }
    }
}

InternalFunctions.init();

// alt.setInterval(() => {
//     ScreenText.draw3D('Me', alt.Player.local.pos);
//     ScreenText.draw2D(`Hello World`, { x: 50, y: 50 });

//     alt.Vehicle.all.forEach((veh) => {
//         const dist = distance2d(veh.pos, alt.Player.local.pos);
//         if (dist >= 10) {
//             return;
//         }

//         ScreenText.draw3D(`Car: ${veh.id}`, veh.pos);
//     });
// }, 0);
