import BadgeStyle from "../enums/BadgeStyle";
import UIMenuItem from "./UIMenuItem";
export default class UIMenuSliderItem extends UIMenuItem {
    private _arrowLeft;
    private _arrowRight;
    private _rectangleBackground;
    private _rectangleSlider;
    private _rectangleDivider;
    private _items;
    private _index;
    get Index(): number;
    set Index(value: number);
    constructor(text: string, items: any[], index: number, description?: string, divider?: boolean, data?: any);
    SetVerticalPosition(y: number): void;
    IndexToItem(index: number): any;
    Draw(): void;
    SetRightBadge(badge: BadgeStyle): void;
    SetRightLabel(text: string): void;
}
