declare module 'alt-client' {
    export interface Player {
        // The time that a player is seen by our local player.
        // Used to reveal nametags.
        inVisionTime: number | null;
    }
}
