import { Meta } from './Meta';

declare module 'alt-client' {
    export interface Player {
        meta?: Meta;
    }
}
