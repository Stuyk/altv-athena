import * as alt from 'alt-client';
import * as native from 'natives';

import { drawRectangle2D, drawText2D } from './text';

interface TextProperties {
    paddingLeft?: number;
    paddingRight?: number;
    paddingTop?: number;
    paddingBottom?: number;
    offsetX?: number;
    offsetY?: number;
}

export class ScreenText {
    /**
     * Used as a utility for strength length.
     * @static
     * @param {string} text
     * @return {*}  {void}
     * @memberof ScreenText
     */
    static addLongString(text: string): void {
        if (!text.length) {
            return;
        }

        const maxStringLength = 99;

        for (let i = 0, position; i < text.length; i += maxStringLength) {
            let currentText = text.substr(i, i + maxStringLength);
            let currentIndex = i;
            if ((currentText.match(/~/g) || []).length % 2 !== 0) {
                position = currentText.lastIndexOf('~');
                i -= maxStringLength - position;
            } else {
                position = Math.min(maxStringLength, text.length - currentIndex);
            }

            native.addTextComponentSubstringPlayerName(text.substr(currentIndex, position));
        }
    }

    /**
     * Get the float width of text. (0.1 - 1)
     * @static
     * @param {string} text
     * @param {number} font
     * @param {number} scale
     * @return {*}  {number}
     * @memberof ScreenText
     */
    static getTextWidth(text: string, font: number, scale: number): number {
        native.beginTextCommandGetWidth('CELL_EMAIL_BCON');
        ScreenText.addLongString(text);
        native.setTextFont(font);
        native.setTextScale(1, scale);
        return native.endTextCommandGetWidth(true);
    }

    /**
     * Get the height of text based on scale and font.
     * @static
     * @param {number} size
     * @param {number} scale
     * @return {*}
     * @memberof ScreenText
     */
    static getTextHeight(scale: number, font: number): number {
        return native.getTextScaleHeight(scale, font);
    }

    /**
     * Draw text with a background and apply padding.
     * @static
     * @param {string} text
     * @param {number} x
     * @param {number} y
     * @param {number} scale
     * @param {number} font
     * @param {alt.RGBA} background
     * @param {alt.RGBA} foreground
     * @param {TextProperties} props
     * @memberof ScreenText
     */
    static drawTextWithBackground(
        text: string,
        x: number,
        y: number,
        scale: number,
        font: number,
        background: alt.RGBA,
        foreground: alt.RGBA,
        props: TextProperties
    ) {
        const textHeight = ScreenText.getTextHeight(scale, font);
        const textWidth = ScreenText.getTextWidth(text, font, scale);
        let textPos = { x: x + 0.1, y: y - textHeight / 2 }; // Center on the rectangle.
        let rectPos = { x: x + 0.1 + textWidth / 2, y }; // Center on the text.
        let rectSize = { x: textWidth, y: textHeight };

        if (props.paddingLeft) {
            textPos.x += props.paddingLeft;
            rectPos.x += props.paddingLeft / 2;
            rectSize.x += props.paddingLeft; // Increase padding on left for rectangle to match size.
        }

        if (props.paddingRight) {
            rectPos.x += props.paddingRight / 2;
            rectSize.x += props.paddingRight; // Increase padding on right for rectangle to match size.
        }

        if (props.paddingTop) {
            textPos.y += props.paddingTop;
            rectPos.y += props.paddingTop / 2;
            rectSize.y += props.paddingTop;
        }

        if (props.paddingBottom) {
            rectPos.y += props.paddingBottom / 2;
            rectSize.y += props.paddingBottom;
        }

        if (props.offsetX) {
            textPos.x += props.offsetX;
            rectPos.x += props.offsetX;
        }

        if (props.offsetY) {
            textPos.y += props.offsetY;
            rectPos.y += props.offsetY;
        }

        drawRectangle2D(rectPos, rectSize, background);
        drawText2D(text, textPos, scale, foreground);
    }
}
