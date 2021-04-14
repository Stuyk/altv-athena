import { LOCALE_KEYS } from './keys';

/**
 * Locales are written with a key and value type.
 * When you get the key of 'greet-user' from the LocaleController
 * It will return a string of 'Hello someVariableYouPass, welcome to the server.'
 * It's a simple way to create locales without hurting performance too much.
 */
export default {
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
    // Weapon
    [LOCALE_KEYS.WEAPON_NO_HASH]: `Weapon does not have a hash.`
};
