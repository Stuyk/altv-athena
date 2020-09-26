import { IConfig } from './IConfig';
import { IDiscord } from './IDiscord';

export interface IAthenaConfig {
    url: string;
    databaseName: string;
    collections: Array<string>;
    username?: string;
    password?: string;
    loadOrder?: string;
    config?: IConfig;
    discord?: IDiscord;
}
