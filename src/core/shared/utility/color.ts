import * as alt from 'alt-shared';

export function rgbaToHexAlpha(color: alt.RGBA): string {
    let r = color.r.toString(16);
    let g = color.g.toString(16);
    let b = color.b.toString(16);

    if (r.length === 1) {
        r = '0' + r;
    }

    if (g.length === 1) {
        g = '0' + g;
    }

    if (b.length === 1) {
        b = '0' + b;
    }

    let alpha = '';
    if (typeof color.a === 'number') {
        let multiplier = 1;
        if (color.a < 1) {
            multiplier = 255;
        }

        alpha = Math.round(color.a * multiplier).toString(16);
        if (alpha.length <= 1) {
            alpha = '0' + alpha;
        }
    }

    return '#' + r + g + b + alpha;
}
