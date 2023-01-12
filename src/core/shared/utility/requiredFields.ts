export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
