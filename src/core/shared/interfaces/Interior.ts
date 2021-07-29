import { IObject } from './IObject';
import { Item } from './Item';
import { Vector3 } from './Vector';

export interface Interior {
    /**
     * This is also the dimension for the interior.
     * May need to be converted into a number.
     * @type {unknown}
     * @memberof Interior
     */
    _id?: unknown;
    outside: Vector3;
    inside: Vector3;

    /**
     * The name to display outside of the interior.
     * @type {string}
     * @memberof Interior
     */
    name: string;

    /**
     * Is this interior currently unlocked?
     * @type {boolean}
     * @memberof Interior
     */
    isUnlocked?: boolean;

    /**
     * A list of character ids who own this property and have full control over it.
     * @type {Array<string>}
     * @memberof Interior
     */
    owners?: Array<string>;

    /**
     * A list of faction ids who own have access to this property.
     * @type {Array<number>}
     * @memberof Interior
     */
    factions?: Array<number>;

    /**
     * Items that can be stored into the interior and are accessible by faction(s) or owner(s).
     * @type {Array<Item>}
     * @memberof Interior
     */
    storage?: Array<Item>;

    /**
     * Objects to give to the client who enters the interior.
     * @type {Array<IObject>}
     * @memberof Interior
     */
    objects?: Array<IObject>;

    /**
     * Optional IPL to associate with this interior.
     * @type {string}
     * @memberof Interior
     */
    ipl?: string;
}
