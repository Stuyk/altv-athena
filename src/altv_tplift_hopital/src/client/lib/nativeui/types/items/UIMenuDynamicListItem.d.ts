import BadgeStyle from "../enums/BadgeStyle";
import ChangeDirection from "../enums/ChangeDirection";
import ResText from "../modules/ResText";
import Sprite from "../modules/Sprite";
import UIMenuItem from "./UIMenuItem";
interface SelectionChangeHandler {
    (item: UIMenuDynamicListItem, selectedValue: string, changeDirection: ChangeDirection): string;
}
export default class UIMenuDynamicListItem extends UIMenuItem {
    protected _itemText: ResText;
    protected _arrowLeft: Sprite;
    protected _arrowRight: Sprite;
    private _currentOffset;
    private _precaptionText;
    private _selectedValue;
    private readonly _selectedStartValueHandler;
    readonly SelectionChangeHandler: SelectionChangeHandler;
    SelectionChangeHandlerPromise(item: UIMenuDynamicListItem, selectedValue: string, changeDirection: ChangeDirection): Promise<unknown>;
    get PreCaptionText(): string;
    set PreCaptionText(text: string);
    get SelectedValue(): string;
    set SelectedValue(value: string);
    constructor(text: string, selectionChangeHandler: {
        (item: UIMenuDynamicListItem, selectedValue: string, changeDirection: ChangeDirection): string;
    }, description?: string, selectedStartValueHandler?: {
        (): string;
    }, data?: any);
    SetVerticalPosition(y: number): void;
    SetRightLabel(text: string): this;
    SetRightBadge(badge: BadgeStyle): this;
    Draw(): void;
    private isVariableFunction;
}
export {};
