/**
 * This interface is used to describe the overall Character Appearance.
 *
 *
 * @interface Appearance
 */
export interface Appearance {
    /**
     * 0 - Female, 1 - Male
     * @type {number}
     *
     */
    sex: number;

    /**
     * Values range from 0 to 45
     * @type {number}
     *
     */
    faceFather: number;

    /**
     * Values range from 0 to 45
     * @type {number}
     *
     */
    faceMother: number;

    /**
     * Values range from 0 to 45
     * @type {number}
     *
     */
    skinFather: number;

    /**
     * Values range from 0 to 45
     * @type {number}
     *
     */
    skinMother: number;

    /**
     * The mix of the mother and father faces.
     * Values range from 0.0 to 1.0
     * @type {number}
     *
     */
    faceMix: number;

    /**
     * The mix of the mother and father faces.
     * Values range from 0.0 to 1.0
     * @type {number}
     *
     */
    skinMix: number;

    /**
     * An array of valid face structure changes.
     * Each position in the array represents a structure change.
     * Values range from -1.0 to 1.0
     * @type {number[]}
     *
     */
    structure: number[];

    /**
     * The hair identifier that this character will be using.
     * Should be a relative id to the dlc hash.
     * @type {number}
     *
     */
    hair: number;

    /**
     * The dlc hash of the hair to use.
     *
     * @type {number}
     *
     */
    hairDlc: number;

    /**
     * The color of the hair.
     * @type {number}
     *
     */
    hairColor1: number;

    /**
     * The highlight color of the hair.
     * @type {number}
     *
     */
    hairColor2: number;

    /**
     * Some hair has a 'shaved look' to it and this is used to
     * achieve that look.
     * @type {{ overlay: string; collection: string }}
     *
     */
    hairOverlay: { overlay: string; collection: string };

    /**
     * The facial hair to show on the character.
     * This will not show without opacity being set.
     * @type {number}
     *
     */
    facialHair: number;

    /**
     * Facial hair color for facial hair.
     * @type {number}
     *
     */
    facialHairColor1: number;

    /**
     * How visible the facial hair should be.
     * Values 0.0 to 1.0
     * @type {number}
     *
     */
    facialHairOpacity: number;

    /**
     * The eyebrows on a character.
     * This will not show without opacity being set.
     * @type {number}
     *
     */
    eyebrows: number;

    /**
     * How visible eyebrows should be.
     * Values 0.0 to 1.0
     * @type {number}
     *
     */
    eyebrowsOpacity: number;

    /**
     * The colors of the eyebrows.
     * @type {number}
     *
     */
    eyebrowsColor1: number;

    /**
     * The chest hair on a character.
     * This will not show without opacity being set.
     * @type {number}
     *
     */
    chestHair: number;

    /**
     * How visible chest hair should be.
     * Values 0.0 to 1.0
     * @type {number}
     *
     */
    chestHairOpacity: number;

    /**
     * The colors of the chest hair.
     * @type {number}
     *
     */
    chestHairColor1: number;

    /**
     * Eye Color
     * @type {number}
     *
     */
    eyes: number;

    /**
     * These have to do with skin appearance more than anything.
     * Blemishes, moles, etc.
     * @type {AppearanceInfo[]}
     *
     */
    opacityOverlays: AppearanceInfo[];

    /**
     * These have to do with makeup, lipstick, etc.
     * @type {ColorInfo[]}
     *
     */
    colorOverlays: ColorInfo[];
}

/**
 * This interface is used to describe appearance info that has colors.
 *
 * @interface ColorInfo
 */
export interface ColorInfo {
    id: number;
    value: number;
    color1: number;
    color2: number;
    opacity: number;
}

/**
 * This interface is used to describe individual appearance information.
 *
 * @interface AppearanceInfo
 */
export interface AppearanceInfo {
    value: number;
    opacity: number;
    id: number;
    collection: string;
    overlay: string;
}
