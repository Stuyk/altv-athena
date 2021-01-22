import { SHARED_CONFIG } from '../../shared/configurations/shared';

export const DEFAULT_CONFIG = {
    // Use Voice
    VOICE_ON: true,
    VOICE_MAX_DISTANCE: 35,
    // Character Selection View
    CHARACTER_SELECT_POS: { x: -504.07794189453125, y: -736.385009765625, z: 32.67851257324219 },
    CHARACTER_SELECT_ROT: { x: 0, y: 0, z: -3.117319107055664 },
    PLAYER_MAX_CHARACTER_SLOTS: 5,
    // Character Creation View
    CHARACTER_CREATOR_POS: { x: -504.07794189453125, y: -736.385009765625, z: 32.67851257324219 },
    CHARACTER_CREATOR_ROT: { x: 0, y: 0, z: -3.117319107055664 },
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
    RESPAWN_HEALTH: 200, // Health is 100 - 200. 99 is dead.
    RESPAWN_ARMOUR: 0, // Lose weapons when you respawn
    // Command Properties
    COMMAND_OOC_DISTANCE: 35,
    COMMAND_ME_DISTANCE: 35,
    COMMAND_DO_DISTANCE: 35,
    COMMAND_LOW_DISTANCE: 10,
    COMMAND_WHISPER_DISTANCE: 5,
    CHAT_ROLEPLAY_OOC_COLOR: `{656565}`, // OOC Color
    CHAT_ROLEPLAY_COLOR: `{C39ADD}`, // Roleplay Color
    CHAT_ROLEPLAY_LOW_COLOR: `{d3d3d3}`, // Low Color
    CHAT_ROLEPLAY_WHISPER_COLOR: `{e6e6ce}`, // Whisper Color
    // Interaction Properties
    MAX_INTERACTION_DISTANCE: 3, // The maximum distance the player can stand away from a interaction object.
    // World Time
    BOOTUP_HOUR: 9,
    BOOTUP_MINUTE: 0,
    MINUTES_PER_MINUTE: 5,
    // Inventory Properites
    TIME_BETWEEN_INVENTORY_UPDATES: 10000,
    // World Properties
    VALID_HOSPITALS: [
        { x: -248.01309204101562, y: 6332.01513671875, z: 33.0750732421875 },
        { x: 1839.15771484375, y: 3672.702392578125, z: 34.51904296875 },
        { x: 297.4647521972656, y: -584.7089233398438, z: 44.292724609375 },
        { x: -677.0172119140625, y: 311.7821350097656, z: 83.601806640625 },
        { x: 1151.2904052734375, y: -1529.903564453125, z: 36.3017578125 }
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
        'CLEARING'
    ],
    // Vehicle Properties
    MAXIMUM_FUEL: 100
};
