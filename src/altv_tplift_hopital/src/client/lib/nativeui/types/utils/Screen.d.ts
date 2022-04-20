import Font from "../enums/Font";
import Point from "./Point";
import Size from "./Size";
export default class Screen {
    static Width: number;
    static Height: number;
    static get ResolutionMaintainRatio(): Size;
    static MousePosition(relative?: boolean): {
        X: number;
        Y: number;
    };
    static IsMouseInBounds(topLeft: Point, boxSize: Size): boolean;
    static GetTextWidth(text: string, font: Font, scale: number): number;
    static GetLineCount(text: string, position: Point, font: Font, scale: number, wrap: number): number;
}
