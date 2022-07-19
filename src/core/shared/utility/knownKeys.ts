export type KnownKeys<T> = {
    [K in keyof T as string extends K ? never : number extends K ? never : K]: T[K];
};

export type OmitFromKnownKeys<T, K extends keyof T> = KnownKeys<T> extends infer U
    ? keyof U extends keyof T
        ? Pick<T, Exclude<keyof U, K>> & Pick<T, Exclude<keyof T, keyof KnownKeys<T>>>
        : never
    : never;

export type RemoveIndex<T> = {
    [P in keyof T as string extends P ? never : number extends P ? never : P]: T[P];
};
