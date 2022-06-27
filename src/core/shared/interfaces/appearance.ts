/**
 * This interface is used to describe the overall Character Appearance.
 * @export
 * @interface Appearance
 */
export interface Appearance {
    /**
     * 0 - Female, 1 - Male
     * @type {number}
     * @memberof Appearance
     */
    sex: number;

    /**
     * Values range from 0 to 45
     * @type {number}
     * @memberof Appearance
     */
    faceFather: number;

    /**
     * Values range from 0 to 45
     * @type {number}
     * @memberof Appearance
     */
    faceMother: number;

    /**
     * Values range from 0 to 45
     * @type {number}
     * @memberof Appearance
     */
    skinFather: number;

    /**
     * Values range from 0 to 45
     * @type {number}
     * @memberof Appearance
     */
    skinMother: number;

    /**
     * The mix of the mother and father faces.
     * Values range from 0.0 to 1.0
     * @type {number}
     * @memberof Appearance
     */
    faceMix: number;

    /**
     * The mix of the mother and father faces.
     * Values range from 0.0 to 1.0
     * @type {number}
     * @memberof Appearance
     */
    skinMix: number;

    /**
     * An array of valid face structure changes.
     * Each position in the array represents a structure change.
     * Values range from -1.0 to 1.0
     * @type {number[]}
     * @memberof Appearance
     */
    structure: number[];

    /**
     * The hair identifier that this character will be using.
     * Should be a relative id to the dlc hash.
     * @type {number}
     * @memberof Appearance
     */
    hair: number;

    /**
     * The dlc hash of the hair to use.
     *
     * @type {number}
     * @memberof Appearance
     */
    hairDlc: number;

    /**
     * The color of the hair.
     * @type {number}
     * @memberof Appearance
     */
    hairColor1: number;

    /**
     * The highlight color of the hair.
     * @type {number}
     * @memberof Appearance
     */
    hairColor2: number;

    /**
     * Some hair has a 'shaved look' to it and this is used to
     * achieve that look.
     * @type {{ overlay: string; collection: string }}
     * @memberof Appearance
     */
    hairOverlay: { overlay: string; collection: string };

    /**
     * The facial hair to show on the character.
     * This will not show without opacity being set.
     * @type {number}
     * @memberof Appearance
     */
    facialHair: number;

    /**
     * Facial hair color for facial hair.
     * @type {number}
     * @memberof Appearance
     */
    facialHairColor1: number;

    /**
     * How visible the facial hair should be.
     * Values 0.0 to 1.0
     * @type {number}
     * @memberof Appearance
     */
    facialHairOpacity: number;

    /**
     * The eyebrows on a character.
     * This will not show without opacity being set.
     * @type {number}
     * @memberof Appearance
     */
    eyebrows: number;

    /**
     * How visible eyebrows should be.
     * Values 0.0 to 1.0
     * @type {number}
     * @memberof Appearance
     */
    eyebrowsOpacity: number;

    /**
     * The colors of the eyebrows.
     * @type {number}
     * @memberof Appearance
     */
    eyebrowsColor1: number;

    /**
     * The chest hair on a character.
     * This will not show without opacity being set.
     * @type {number}
     * @memberof Appearance
     */
    chestHair: number;

    /**
     * How visible chest hair should be.
     * Values 0.0 to 1.0
     * @type {number}
     * @memberof Appearance
     */
    chestHairOpacity: number;

    /**
     * The colors of the chest hair.
     * @type {number}
     * @memberof Appearance
     */
    chestHairColor1: number;

    /**
     * Eye Color
     * @type {number}
     * @memberof Appearance
     */
    eyes: number;

    /**
     * These have to do with skin appearance more than anything.
     * Blemishes, moles, etc.
     * @type {AppearanceInfo[]}
     * @memberof Appearance
     */
    opacityOverlays: AppearanceInfo[];

    /**
     * These have to do with makeup, lipstick, etc.
     * @type {ColorInfo[]}
     * @memberof Appearance
     */
    colorOverlays: ColorInfo[];
}

/**
 * This interface is used to describe appearance info that has colors.
 * @export
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
 * @export
 * @interface AppearanceInfo
 */
export interface AppearanceInfo {
    value: number;
    opacity: number;
    id: number;
    collection: string;
    overlay: string;
}
