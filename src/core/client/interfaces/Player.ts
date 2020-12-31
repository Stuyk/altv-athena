import { Meta } from './Meta';

declare module 'alt-client' {
    export interface Player {
        meta: Partial<Meta>;
        isMenuOpen: boolean;
        inVisionTime: number | null;
    }
}
