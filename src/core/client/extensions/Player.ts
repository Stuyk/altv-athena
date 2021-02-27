import * as alt from 'alt-client';
import { Item } from 'core/shared/interfaces/Item';
import { Meta } from './Meta';

declare module 'alt-client' {
    export interface Player {
        // Used to store data sent down from the server-side.
        meta: Partial<Meta>;

        // Check if a re-usable WebView is open.
        isMenuOpen: boolean;
        isChatOpen: boolean;
        isActionMenuOpen: boolean;

        // The time that a player is seen by our local player.
        // Used to reveal nametags.
        inVisionTime: number | null;

        // Interaction Mode Settings
        isInteractionOn: boolean;

        // Used for ATMs, Vending Machines, etc.
        closestInteraction: { type: string; position: alt.Vector3 };
    }
}
