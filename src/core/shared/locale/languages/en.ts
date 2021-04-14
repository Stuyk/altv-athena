import { LOCALE_KEYS } from './keys';

/**
 * Locales are written with a key and value type.
 * When you get the key of 'greet-user' from the LocaleController
 * It will return a string of 'Hello someVariableYouPass, welcome to the server.'
 * It's a simple way to create locales without hurting performance too much.
 */
export default {
    // Commands
    [LOCALE_KEYS.COMMAND_ADMIN_CHAT]: `_%_ [message] - Speak to other admins`,
    [LOCALE_KEYS.COMMAND_ACCEPT_DEATH]: `_%_ - Respawn at hospital after death`,
    [LOCALE_KEYS.COMMAND_ACTION_MENU]: `_%_ - Create a test action menu`,
    [LOCALE_KEYS.COMMAND_ADD_VEHICLE]: `_%_ [model] - Add a vehicle to your player`,
    [LOCALE_KEYS.COMMAND_ADD_WHITELIST]: `_%_ [discord] - Whitelist a player by Discord ID`,
    [LOCALE_KEYS.COMMAND_AUDIOSTREAM]: `_%_ [youtube] - Create a Test Audio Stream`,
    [LOCALE_KEYS.COMMAND_OOC]: `_%_ [message] - Speak out of character`,
    [LOCALE_KEYS.COMMAND_BROADCAST]: `_%_ [message] - Announce message server wide`,
    [LOCALE_KEYS.COMMAND_DO]: `_%_ [message] - Describe an object, sound, etc.`,
    [LOCALE_KEYS.COMMAND_DUMMY_ITEM]: `_%_ - Get some debug items`,
    [LOCALE_KEYS.COMMAND_GET_ITEM]: `_%_ [item-name] - Get an item by name`,
    [LOCALE_KEYS.COMMAND_LOW]: `_%_ [message] - Speak quietly`,
    [LOCALE_KEYS.COMMAND_MOD_CHAT]: `_%_ [message] - Speak to Admins & Mods`,
    [LOCALE_KEYS.COMMAND_ME]: `_%_ [message] - Describe a roleplay action`,
    [LOCALE_KEYS.COMMAND_NO_CLIP]: `_%_ - Toggle No Clip Mode`,
    [LOCALE_KEYS.COMMAND_QUIT_JOB]: `_%_ - Quit a Job`,
    [LOCALE_KEYS.COMMAND_REMOVE_ALL_WEAPONS]: `_%_ - Remove all weapons`,
    [LOCALE_KEYS.COMMAND_REMOVE_WHITELIST]: `_%_ [discord] - Remove Discord ID from whitelist`,
    [LOCALE_KEYS.COMMAND_REVIVE]: `_%_ [player_id]* - Revive self or others`,
    [LOCALE_KEYS.COMMAND_SEATBELT]: `_%_ - Put on a seatbelt or helmet`,
    [LOCALE_KEYS.COMMAND_SET_ARMOUR]: `_%_ [0-100][player_id]* - Set armour for self or others`,
    [LOCALE_KEYS.COMMAND_SET_CASH]: `_%_ [value] - Set your cash on hand`,
    [LOCALE_KEYS.COMMAND_SET_FOOD]: `_%_ [0-100] - Set your hunger level`,
    [LOCALE_KEYS.COMMAND_SET_HEALTH]: `_%_ [99-199][player_id]* - Set health for self or others`,
    [LOCALE_KEYS.COMMAND_SET_WATER]: `_%_ [0-100] - Set your thirst level`,
    [LOCALE_KEYS.COMMAND_SPAWN_VEHICLE]: `_%_ [index] - Spawn personal vehicle by index`,
    [LOCALE_KEYS.COMMAND_TELEPORTER]: `_%_ - Teleport back to current location with an item`,
    [LOCALE_KEYS.COMMAND_UPDATE_WEATHER]: `_%_ - Forces synchronization of weather`,
    [LOCALE_KEYS.COMMAND_VEHICLE]: `_%_ [model] - Spawn an admin vehicle`,
    [LOCALE_KEYS.COMMAND_WHISPER]: `_%_ [player_id][message] - Privately whisper to a nearby player`,
    [LOCALE_KEYS.COMMAND_WEAPON]: `_%_ [name] - Get a weapon by name`,
    // Cannot
    [LOCALE_KEYS.CANNOT_FIND_PLAYER]: `Could not find that player.`,
    [LOCALE_KEYS.CANNOT_PERFORM_WHILE_DEAD]: `Cannot perform this command while you are dead.`,
    // Invalid
    [LOCALE_KEYS.INVALID_VEHICLE_MODEL]: `Vehicle model is not vehicle.`,
    // Interaction
    [LOCALE_KEYS.INTERACTION_TOO_FAR_AWAY]: `You are too far away to interact. Move closer.`,
    [LOCALE_KEYS.INTERACTION_INVALID_OBJECT]: `This object does not have an interaction.`,
    // Item
    [LOCALE_KEYS.ITEM_NOT_EQUIPPED]: `No item is equipped in that slot.`,
    // Labels
    [LOCALE_KEYS.LABEL_ON]: `ON`,
    [LOCALE_KEYS.LABEL_OFF]: `OFF`,
    // Player
    [LOCALE_KEYS.PLAYER_IS_TOO_FAR]: `That player is too far away.`,
    [LOCALE_KEYS.PLAYER_IS_TOO_CLOSE]: `That player is too close.`,
    [LOCALE_KEYS.PLAYER_IS_NOT_DEAD]: `That player is not dead.`,
    [LOCALE_KEYS.PLAYER_ARMOUR_SET_TO]: `Your armour was set to: _%_`,
    [LOCALE_KEYS.PLAYER_HEALTH_SET_TO]: `Your health was set to: _%_`,
    [LOCALE_KEYS.PLAYER_SEATBELT_ON]: `You put on your seatbelt.`,
    [LOCALE_KEYS.PLAYER_SEATBELT_OFF]: `You take off your seatbelt.`,
    // Weapon
    [LOCALE_KEYS.WEAPON_NO_HASH]: `Weapon does not have a hash.`
};
