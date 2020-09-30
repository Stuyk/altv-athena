import { Config } from './IConfig';
import { Discord } from './IDiscord';

export interface AthenaConfig {
    url: string;
    databaseName: string;
    collections: Array<string>;
    username?: string;
    password?: string;
    loadOrder?: string;
    config?: Config;
    discord?: Discord;
}
