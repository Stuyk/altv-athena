import '../systems/chat';

export const DEFAULT_CONFIG = {
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
    // Command Properties
    COMMAND_ME_DISTANCE: 35,
    COMMAND_DO_DISTANCE: 35,
    COMMAND_LOW_DISTANCE: 10,
    COMMAND_WHISPER_DISTANCE: 5
};
