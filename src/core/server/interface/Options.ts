export type DiscordID = string;

export interface Options {
    _id?: any;
    whitelist?: Array<DiscordID>;
}

export const defaultOptions = {
    whitelist: []
};
