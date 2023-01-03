export interface CategoryData {
    abbrv?: string;
    name: 'inventory' | 'equipment' | 'toolbar' | 'ground';
    emptyCheck?: Function;
    getItem?: Function;
    removeItem?: Function;
    addItem?: Function;
}
