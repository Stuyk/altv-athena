import * as alt from 'alt-server';
import { MarkerController } from '../../server/systems/marker';
import { ObjectController } from '../../server/systems/object';
import { TextLabelController } from '../../server/systems/textlabel';
import { Vector3 } from '../../shared/interfaces/Vector';

const startPosition = { x: -701.8373413085938, y: -74.20274353027344, z: 37.76566696166992 };
const endPosition = { x: -987.7802734375, y: -221.34121704101562, z: 37.885276794433594 };

function lerp(first: number, second: number, byProduct: number) {
    return first * (1 - byProduct) + second * byProduct;
}

function getBetweenPoints(vec1: Vector3, vec2: Vector3, dist: number) {
    return new alt.Vector3(lerp(vec1.x, vec2.x, dist), lerp(vec1.y, vec2.y, dist), vec1.z);
}

function test() {
    for (let i = 0; i < 100; i++) {
        const by = i * 0.01;
        const pos = getBetweenPoints(startPosition, endPosition, by);
        MarkerController.append({ uid: `test-marker-${i}`, pos, type: 1, color: new alt.RGBA(255, 255, 255, 125) });
        TextLabelController.append({ uid: `test-text-${i}`, pos, data: `Text - ${i}` });
        ObjectController.append({ uid: `test-object-${i}`, model: 'prop_ld_int_safe_01', pos });
    }
}

// test();
