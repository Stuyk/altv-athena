import { IMeta } from './IMeta';

declare module 'alt-client' {
    export interface Player {
        meta?: IMeta;
    }
}
