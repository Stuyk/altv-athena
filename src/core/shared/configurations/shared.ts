export const SHARED_CONFIG = {
    // Moved over from server/athena/main.ts cause this is not loadable on clients
    PLAYER_NEW_SPAWN_POS: { x: -867.1437377929688, y: -172.6201934814453, z: 37.799232482910156 },
    PLAYER_CASH: 100,
    PLAYER_BANK: 100,
    // Default Respawn Time for Player
    RESPAWN_TIME: 25000,
    // FOOD & WATER
    FOOD_FATIGUE: 10, // If food drops below this number the player stops sprinting.
    WATER_FATIGUE: 8, // If water drops below this number the player stops sprinting.
    // Inventory
    MAX_PICKUP_RANGE: 2,
    // Interaction
    MAX_INTERACTION_RANGE: 8,
    // Max Vehicle Interaction Range
    MAX_VEHICLE_INTERACTION_RANGE: 2.5,
    // Voice
    VOICE_ON: false,
    // HUD
    USE_24H_TIME_FORMAT: false,
    // Idle Cam
    DISABLE_IDLE_CAM: false,
};
