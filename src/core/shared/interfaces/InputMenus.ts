export enum InputOptionType {
    TEXT = 'text',
    NUMBER = 'number'
}

export interface InputOption {
    id: string;
    desc: string;
    type: InputOptionType;
    placeholder: string;
    error?: string;
    regex?: string;
}

export interface InputResult {
    id: string;
    value: string | null;
}

export interface InputMenu {
    title: string;
    options: InputOption[];
    callback?: (results: InputResult[]) => void;
    serverEvent?: string;
}
