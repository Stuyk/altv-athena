export type ExtractStringKeys<TInterface extends Record<any, any>> = keyof {
    [K in keyof TInterface as Extract<K, string>]: TInterface[K];
};
