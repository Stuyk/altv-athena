import { Config } from './Config';
import { Discord } from './Discord';

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
