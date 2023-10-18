import { SHARED_CONFIG } from '../../shared/configurations/shared.js';
import StreamConfiguration from './stream/config.js';

export const DEFAULT_CONFIG = {
    // Character Selection View
    CHARACTER_SELECT_POS: { x: -145.9370574951172, y: -575.7879638671875, z: 32.424442291259766 },
    CHARACTER_SELECT_ROT: 249.58352661132812,
    // Character Creation View
    CHARACTER_CREATOR_POS: { x: -145.9370574951172, y: -575.7879638671875, z: 32.424442291259766 },
    CHARACTER_CREATOR_ROT: 249.58352661132812,
    // New Character Properties
    PLAYER_NEW_SPAWN_POS: { x: -867.1437377929688, y: -172.6201934814453, z: 37.799232482910156 },
    PLAYER_CASH: 100,
    PLAYER_BANK: 100,
    // Interaction Properties
    MAX_INTERACTION_DISTANCE: 3, // The maximum distance the player can stand away from a interaction object.
    // Vehicle Properties
    TIME_BETWEEN_VEHICLE_SAVES: 30000, // 30s
    DESPAWN_VEHICLES_ON_LOGOUT: false, // Will despawn all player vehicles on logout.
    VEHICLE_SPAWN_TIMEOUT: 24, // Hours that must pass since a vehicle was last used to avoid spawning on server restart.
    VEHICLE_MAX_DISTANCE_TO_ENTER: SHARED_CONFIG.MAX_VEHICLE_INTERACTION_RANGE, // Max distance to enter a vehicle.
    VEHICLE_DISPLAY_LOCK_STATUS: true, // Display vehicle lock status above vehicle
    VEHICLE_DISPLAY_LOCK_INTERACTION_INFO: true, // Display interaction info in hud
    VEHICLE_DESPAWN_TIMEOUT: 30000,
    // The Default Stream Configuration for Markers, Text Labels, etc.
    STREAM_CONFIG: StreamConfiguration,
    // The Default Faction Configurations
    LOGIN_REDIRECT_URL: null, // Set this to something other than null to redirect to a specific url.
};
