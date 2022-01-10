export interface CategoryData {
    abbrv?: string;
    name: string;
    emptyCheck?: Function;
    getItem?: Function;
    removeItem?: Function;
    addItem?: Function;
}
