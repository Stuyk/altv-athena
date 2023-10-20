import * as alt from 'alt-client';
import * as native from 'natives';
import * as AthenaClient from '@AthenaClient/api/index.js';
import { StaticTextInfo } from './staticTextInterfaces.js';

type StaticTextExt = StaticTextInfo & { delete?: boolean; element?: alt.RmlElement };

let document: alt.RmlDocument;
let interval: number;
let drawables: Map<string, StaticTextExt> = new Map();

function roundToTwo(value: number) {
    return Math.round(value * 100 + Number.EPSILON) / 100;
}

const InternalFunctions = {
    destroy() {
        alt.clearInterval(interval);
        interval = undefined;

        document.destroy();
        document = undefined;
    },
    removeElement(drawablesElement: alt.RmlElement, drawable: StaticTextExt) {
        drawablesElement.removeChild(drawable.element);
        drawables.delete(drawable.uid);
        drawable.element.destroy();
        drawable.element = undefined;
    },
    tick() {
        if (AthenaClient.webview.isAnyMenuOpen()) {
            return;
        }

        if (!document) {
            return;
        }

        if (drawables.size <= 0) {
            return;
        }

        const drawablesElement = document.getElementByID('drawables');
        if (!drawablesElement) {
            return;
        }

        drawables.forEach((drawable) => {
            if (!drawable || !drawable.element) {
                return;
            }

            const dist = AthenaClient.utility.vector.distance(alt.Player.local.pos, drawable.position);
            const isOnScreen = native.isSphereVisible(
                drawable.position.x,
                drawable.position.y,
                drawable.position.z,
                0.0099999998,
            );

            if (dist > drawable.distance || !isOnScreen) {
                drawable.element.addClass('hidden');
                return;
            }

            if (drawable.element.hasClass('hidden')) {
                drawable.element.removeClass('hidden');
            }

            const scale = (drawable.distance - dist) / drawable.distance; // 0.0 - 1.0
            const screenPos = alt.worldToScreen(drawable.position);

            drawable.element.innerRML = drawable.text;
            drawable.element.style['left'] = `${screenPos.x}px`;
            drawable.element.style['top'] = `${screenPos.y}px`;
            drawable.element.style['transform'] = `scale(${roundToTwo(scale)})`;
        });
    },
};

/**
 * Create in-world static text.
 * If the same uid is used it will simply replace the object.
 *
 * @param {alt.IVector3} pos A position in the world.
 * @param {Array<OptionFor3DMenu>} options
 * @param {number} maxDistance
 * @return {void}
 */
export function upsert(drawable: StaticTextInfo): void {
    if (typeof document === 'undefined') {
        document = new alt.RmlDocument('/client/rmlui/staticText/index.rml');
        document.show();
        interval = alt.setInterval(InternalFunctions.tick, 0);
    }

    const drawablesElement = document.getElementByID('drawables');
    if (drawables.has(drawable.uid)) {
        const existingElement = drawables.get(drawable.uid);
        drawables.set(drawable.uid, {
            ...drawable,
            element: existingElement.element,
            delete: existingElement.delete,
        });
    } else {
        const element = document.createElement('div');
        element.setAttribute('id', drawable.uid);
        element.addClass('drawable');
        element.addClass('hidden');
        drawablesElement.appendChild(element);
        drawables.set(drawable.uid, { ...drawable, element, delete: false });
    }
}

/**
 * Remove static text based on uid.
 * Marks for deletion, and then removes it.
 *
 * @param {string} uid A unique string
 */
export function remove(uid: string) {
    if (!drawables.has(uid)) {
        return;
    }

    const existingElement = drawables.get(uid);
    if (!existingElement) {
        return;
    }

    const drawablesElement = document.getElementByID('drawables');
    InternalFunctions.removeElement(drawablesElement, existingElement);
}

alt.on('disconnect', () => {
    if (typeof document !== 'undefined') {
        document.destroy();
        alt.log('staticText | Destroyed RMLUI Document on Disconnect');
    }
});
