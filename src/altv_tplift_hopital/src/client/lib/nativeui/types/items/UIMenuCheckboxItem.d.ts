import BadgeStyle from "../enums/BadgeStyle";
import UIMenuItem from "./UIMenuItem";
export default class UIMenuCheckboxItem extends UIMenuItem {
    private readonly _checkedSprite;
    Checked: boolean;
    constructor(text: string, check?: boolean, description?: string);
    SetVerticalPosition(y: number): void;
    Draw(): void;
    SetRightBadge(badge: BadgeStyle): this;
    SetRightLabel(text: string): this;
}
