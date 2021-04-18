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
    [LOCALE_KEYS.CANNOT_FIND_PERSONAL_VEHICLES]: `Cannot find any personal vehicles.`,
    [LOCALE_KEYS.CANNOT_FIND_THAT_PERSONAL_VEHICLE]: 'Cannot locate that personal vehicle.',
    // Clothing
    [LOCALE_KEYS.CLOTHING_ITEM_IN_INVENTORY]: `A clothing item was sent to your inventory.`,
    // Discord
    [LOCALE_KEYS.DISCORD_ID_NOT_LONG_ENOUGH]: `Discord ID must be at least 18 characters long.`,
    [LOCALE_KEYS.DISCORD_ALREADY_WHITELISTED]: `_%_ is already whitelisted.`,
    [LOCALE_KEYS.DISCORD_NOT_WHITELISTED]: `_%_ is not whitelisted.`,
    [LOCALE_KEYS.DISCORD_ADDED_WHITELIST]: `_%_ was added to the whitelist.`,
    [LOCALE_KEYS.DISCORD_REMOVED_WHITELIST]: `_%_ was removed from the whitelist.`,
    // FUEL
    [LOCALE_KEYS.FUEL_EXIT_VEHICLE_FIRST]: `You must exit your vehicle before fueling.`,
    [LOCALE_KEYS.FUEL_UPDATE_VEHICLE_FIRST]: `You must enter and exit a vehicle first to fuel.`,
    [LOCALE_KEYS.FUEL_VEHICLE_NOT_CLOSE]: `Vehicle is not close enough to fuel.`,
    [LOCALE_KEYS.FUEL_ALREADY_FULL]: `Vehicle already has enough fuel.`,
    [LOCALE_KEYS.FUEL_TOO_FAR_FROM_PUMP]: `Pump is too far from vehicle.`,
    [LOCALE_KEYS.FUEL_HAS_UNLIMITED]: `Vehicle has unlimited fuel. No refuel necessary.`,
    [LOCALE_KEYS.FUEL_CANNOT_AFFORD]: `You cannot afford any fuel.`,
    [LOCALE_KEYS.FUEL_PAYMENT]: `You will pay $_%_ for _%_ units of fuel. Run this menu again to cancel fueling.`,
    [LOCALE_KEYS.FUEL_PAID]: `You paid $_%_ for _%_ units of fuel.`,
    // Invalid
    [LOCALE_KEYS.INVALID_VEHICLE_MODEL]: `Vehicle model is not vehicle.`,
    // Interaction
    [LOCALE_KEYS.INTERACTION_TOO_FAR_AWAY]: `You are too far away to interact. Move closer.`,
    [LOCALE_KEYS.INTERACTION_INVALID_OBJECT]: `This object does not have an interaction.`,
    [LOCALE_KEYS.INTERACTION_INTERACT_WITH_OBJECT]: `Interact with Object`,
    // Item
    [LOCALE_KEYS.ITEM_NOT_EQUIPPED]: `No item is equipped in that slot.`,
    [LOCALE_KEYS.ITEM_DOES_NOT_EXIST]: `_%_ does not exist.`,
    [LOCALE_KEYS.ITEM_WAS_ADDED_INVENTORY]: `_%_ was added to your inventory.`,
    [LOCALE_KEYS.ITEM_WAS_ADDED_EQUIPMENT]: `_%_ was added to your equipment.`,
    [LOCALE_KEYS.ITEM_WAS_ADDED_TOOLBAR]: `_%_ was added to your toolbar.`,
    // Job
    [LOCALE_KEYS.JOB_ALREADY_WORKING]: `You are already working on a job.`,
    [LOCALE_KEYS.JOB_NOT_WORKING]: `You are not currently working.`,
    [LOCALE_KEYS.JOB_QUIT]: `You have quit your current job.`,
    // Labels
    [LOCALE_KEYS.LABEL_ON]: `ON`,
    [LOCALE_KEYS.LABEL_OFF]: `OFF`,
    [LOCALE_KEYS.LABEL_BROADCAST]: `Broadcast`,
    [LOCALE_KEYS.LABEL_ENGINE]: `Engine`,
    // Player
    [LOCALE_KEYS.PLAYER_IS_TOO_FAR]: `That player is too far away.`,
    [LOCALE_KEYS.PLAYER_IS_TOO_CLOSE]: `That player is too close.`,
    [LOCALE_KEYS.PLAYER_IS_NOT_DEAD]: `That player is not dead.`,
    [LOCALE_KEYS.PLAYER_ARMOUR_SET_TO]: `Your armour was set to: _%_`,
    [LOCALE_KEYS.PLAYER_HEALTH_SET_TO]: `Your health was set to: _%_`,
    [LOCALE_KEYS.PLAYER_SEATBELT_ON]: `You put on your seatbelt.`,
    [LOCALE_KEYS.PLAYER_SEATBELT_OFF]: `You take off your seatbelt.`,
    [LOCALE_KEYS.PLAYER_RECEIVED_BLANK]: `You received _%_ from _%_`,
    // Use
    [LOCALE_KEYS.USE_FUEL_PUMP]: 'Use Fuel Pump',
    [LOCALE_KEYS.USE_ATM]: 'Use ATM',
    [LOCALE_KEYS.USE_VENDING_MACHINE]: 'Use Vending Machine',
    [LOCALE_KEYS.USE_CLOTHING_STORE]: 'Browse Clothing',
    // Weapon
    [LOCALE_KEYS.WEAPON_NO_HASH]: `Weapon does not have a hash.`,
    // Vehicle
    [LOCALE_KEYS.VEHICLE_NO_FUEL]: `Vehicle has no fuel.`,
    [LOCALE_KEYS.VEHICLE_LOCK_SET_TO]: `Vehicle lock has been set to: _%_`
};
