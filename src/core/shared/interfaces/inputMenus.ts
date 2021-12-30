export enum InputOptionType {
    TEXT = 'text',
    NUMBER = 'number',
    CHOICE = 'choice',
}

export interface SelectOption {
    text: string;
    value: string;
}

export interface InputOption {
    id: string;
    desc: string;
    type: InputOptionType;
    placeholder: string;
    error?: string;
    regex?: string;
    choices?: SelectOption[];
}

export interface InputResult {
    id: string;
    value: string | null;
}

export interface InputMenu {
    title: string;
    options?: InputOption[];
    callback?: (results: InputResult[] | null) => void;
    serverEvent?: string;
    generalOptions?: InputGeneralOptions;
}

export interface InputGeneralOptions {
    /**
     * Inject a paragraph above all input elements.
     * @type {string}
     * @memberof InputOptions
     */
    description?: string;

    /**
     * What does the 'submit' button display to the user.
     * @type {string}
     * @memberof InputOptions
     */
    submitText?: string;

    /**
     * What does the 'cancel' button display to the user.
     * @type {string}
     * @memberof InputOptions
     */
    cancelText?: string;

    /**
     * Do we skip 'regex' checks.
     * Basically turns this into a accept / decline.
     * @type {boolean}
     * @memberof InputOptions
     */
    skipChecks?: boolean;
}
