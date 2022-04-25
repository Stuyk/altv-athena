import { SHARED_CONFIG } from '../../shared/configurations/shared';
import StreamConfiguration from './stream/config';

export const DEFAULT_CONFIG = {
    // Character Selection View
    CHARACTER_SELECT_POS: { x: -145.9370574951172, y: -575.7879638671875, z: 32.424442291259766 },
    CHARACTER_SELECT_ROT: 249.58352661132812,
    PLAYER_MAX_CHARACTER_SLOTS: 5,
    // Character Creation View
    CHARACTER_CREATOR_POS: { x: -145.9370574951172, y: -575.7879638671875, z: 32.424442291259766 },
    CHARACTER_CREATOR_ROT: 249.58352661132812,
    // New Character Properties
    PLAYER_NEW_SPAWN_POS: { x: -867.1437377929688, y: -172.6201934814453, z: 37.799232482910156 },
    PLAYER_CASH: 100,
    PLAYER_BANK: 100,
    // Chat Properties
    CHAT_ENABLED: true, // Turn off messaging. Chat still works for commands.
    CHAT_DISTANCE: 35,
    // Death / Respawn Properties
    RESPAWN_TIME: SHARED_CONFIG.RESPAWN_TIME, // 30s in Milliseconds
    RESPAWN_LOSE_WEAPONS: true, // Removes player weapons on death.
    RESPAWN_HEALTH: 199, // Health is 100 - 199. 99 is dead. 200 will return 101%.
    RESPAWN_ARMOUR: 0, // Lose weapons when you respawn
    // Interaction Properties
    MAX_INTERACTION_DISTANCE: 3, // The maximum distance the player can stand away from a interaction object.
    // World Time
    BOOTUP_HOUR: 9,
    BOOTUP_MINUTE: 0,
    MINUTES_PER_MINUTE: 5,
    USE_SERVER_TIME: true, // Overwrites the server time to use the current time of the computer it is running on.
    // Food Properties
    TIME_BETWEEN_FOOD_UPDATES: 10000,
    WATER_REMOVAL_RATE: 0.08, // How much food to remove every update.
    FOOD_REMOVAL_RATE: 0.05, // How much water to remove every update.
    // World Properties
    VALID_HOSPITALS: [
        { x: -248.01309204101562, y: 6332.01513671875, z: 33.0750732421875 },
        { x: 1839.15771484375, y: 3672.702392578125, z: 34.51904296875 },
        { x: 297.4647521972656, y: -584.7089233398438, z: 44.292724609375 },
        { x: -677.0172119140625, y: 311.7821350097656, z: 83.601806640625 },
        { x: 1151.2904052734375, y: -1529.903564453125, z: 36.3017578125 },
    ],
    WEATHER_ROTATION: [
        'EXTRASUNNY',
        'EXTRASUNNY',
        'CLEAR',
        'CLOUDS',
        'OVERCAST',
        'RAIN',
        'THUNDER',
        'RAIN',
        'FOGGY',
        'OVERCAST',
        'CLEARING',
    ],
    // Vehicle Properties
    TIME_BETWEEN_VEHICLE_UPDATES: 10000, // 10s
    TIME_BETWEEN_VEHICLE_SAVES: 30000, // 30s
    SPAWN_ALL_VEHICLES_ON_START: true, // Will spawn all vehicles unless they're in a garage.
    SPAWN_VEHICLES_ON_JOIN: false, // Will spawn all player vehicles not in a garage on join. Does not work if SPAWN_ALL_VEHICLES_ON_START is enabled.
    DESPAWN_VEHICLES_ON_LOGOUT: false, // Will despawn all player vehicles on logout.
    VEHICLE_SPAWN_TIMEOUT: 24, // Hours that must pass since a vehicle was last used to avoid spawning on server restart.
    VEHICLE_MAX_DISTANCE_TO_ENTER: SHARED_CONFIG.MAX_VEHICLE_INTERACTION_RANGE, // Max distance to enter a vehicle.
    VEHICLE_DISPLAY_LOCK_STATUS: true, // Display vehicle lock status above vehicle
    VEHICLE_DISPLAY_LOCK_INTERACTION_INFO: true, // Display interaction info in hud
    // The Default Stream Configuration for Markers, Text Labels, etc.
    STREAM_CONFIG: StreamConfiguration,
    // The Default Faction Configurations
    MAX_LOG_LENGTH: 50, // Larger logs may have unintended side-effects.
    LOGIN_REDIRECT_URL: null, // Set this to something other than null to redirect to a specific url.
};
