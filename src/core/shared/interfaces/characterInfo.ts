/**
 * Used for supplying general character information to the Database.
 *
 *
 * @interface CharacterInfo
 */
export interface CharacterInfo {
    /**
     * A custom field for character information about gender.
     * Yes Athena is a progressive framework.
     * @type {string}
     *
     */
    gender?: string;

    /**
     * This is normally an actual age number value.
     * Set as any just in case externals are changed for age.
     * @type {*}
     *
     */
    age?: any;
}
