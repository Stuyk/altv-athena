import * as alt from 'alt-client';

const blips: { [key: string]: Array<Blip> } = {};

/**
 * An extension of PointBlip.
 * Use StreamBlip for safe creation / deletion of blips.
 * @export
 * @class Blip
 * @extends {alt.PointBlip}
 */
export class Blip extends alt.PointBlip {
    public maxDrawDistance: number | null;

    /**
     * Creates an instance of a Blip with extended functionality.
     * @param {alt.Vector3} pos Position of the blip
     * @param {number} sprite The sprit identifier / image
     * @param {number} color The color of the blip
     * @param {string} name The name of the blip
     * @param {boolean} [shortRange=true] Should this display all of the time on the minimap?
     * @memberof Blip
     */
    constructor(pos: alt.Vector3, sprite: number, color: number, name: string, shortRange = true) {
        super(pos.x, pos.y, pos.z);
        this.sprite = sprite;
        this.color = color;
        this.shortRange = shortRange;
        this.name = name;
    }

    /**
     * Remove a blip from the category and destroy it.
     * @param {string} categoryName
     * @return {*}
     * @memberof Blip
     */
    destroyFromCategory(categoryName: string): void {
        if (!blips[categoryName]) {
            return;
        }

        const index = blips[categoryName].findIndex((x) => x === this);
        if (index <= -1) {
            this.destroy();
            return;
        }

        blips[categoryName].splice(index, 1);
        this.destroy();
    }

    /**
     * Sets the maximum draw distance for this blip.
     * @param {(number | null)} distance Set to null to clear draw distance limits.
     * @memberof Blip
     */
    addMaxDrawDistance(distance: number | null): void {
        this.maxDrawDistance = distance;
    }

    /**
     * Add this blip to a clearable category. Great for organization.
     * @param {string} categoryName The category name.
     * @memberof Blip
     */
    addCategory(categoryName: string): void {
        if (!blips[categoryName]) {
            blips[categoryName] = [];
        }

        blips[categoryName].push(this);
    }

    /**
     * Used to assign properties and keep proper blip display.
     * Example: blip.updateProperty('sprite', 1);
     * @param {string} propertyName
     * @param {*} value
     * @return {*}
     * @memberof Blip
     */
    updateProperty(propertyName: string, value: any): void {
        if (!this[propertyName]) {
            alt.logWarning(`Blip Property Name: ${propertyName} does not exist.`);
            return;
        }

        this[propertyName] = value;
        this.updateBlip();
    }

    /**
     * Butchers an entire category.
     * Destroys the blips as well.
     * @static
     * @param {string} categoryName
     * @memberof Blip
     */
    public static async clearEntireCategory(categoryName: string): Promise<boolean> {
        if (!blips[categoryName] || !Array.isArray(blips[categoryName])) {
            return true;
        }

        return new Promise((resolve) => {
            while (blips[categoryName].length > 0) {
                blips[categoryName].pop().destroy();
            }

            return resolve(true);
        });
    }

    /**
     * Get all the blips in a category by name.
     * @static
     * @param {string} categoryName
     * @return {*}  {Array<Blip>}
     * @memberof Blip
     */
    public static getBlipsInCategory(categoryName: string): Array<Blip> {
        if (!blips[categoryName] || !Array.isArray(blips[categoryName])) {
            return [];
        }

        return blips[categoryName];
    }

    /**
     * Used to update the blip after property changes.
     * @private
     * @memberof Blip
     */
    private updateBlip(): void {
        this.sprite = this.sprite;
        this.color = this.color;
        this.shortRange = this.shortRange;
        this.name = this.name;
    }
}

/**
 * Should be used as the main Blip Class for streaming / handling.
 * @export
 * @class StreamBlip
 */
export class StreamBlip {
    private blip: Blip;
    private category: string;
    private sprite: number;
    private color: number;
    private shortRange: boolean;
    private name: string;
    private maxDistance: number | null;
    public pos: alt.Vector3;

    constructor(
        pos: alt.Vector3,
        sprite: number,
        color: number,
        name: string,
        category: string | null,
        maxDistance: number | null,
        shortRange = true,
    ) {
        this.pos = pos;
        this.sprite = sprite;
        this.color = color;
        this.shortRange = shortRange;
        this.name = name;
        this.maxDistance = maxDistance;
        this.category = category;

        // If it uses max distance. Don't instantly spawn it.
        if (this.maxDistance) {
            return;
        }

        this.safeCreate();
    }

    safeCreate(): void {
        if (this.blip) {
            return;
        }

        this.blip = new Blip(this.pos, this.sprite, this.color, this.name, this.shortRange);
        if (this.category) {
            this.blip.addCategory(this.category);
        }
    }

    safeDestroy(): void {
        if (!this.blip) {
            return;
        }

        if (this.category) {
            this.blip.destroyFromCategory(this.category);
            this.blip = null;
        } else {
            this.blip.destroy();
            this.blip = null;
        }
    }
}
