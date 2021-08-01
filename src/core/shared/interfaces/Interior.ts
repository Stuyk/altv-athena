import { INTERIOR_TYPES } from '../flags/interiorFlags';
import { IObject } from './IObject';
import { Item } from './Item';
import { Vector3 } from './Vector';
import { INTERIOR_SYSTEM } from '../flags/InteriorFlags';

export interface Interior {
    /**
     * The database entry id for this interior
     * @type {unknown}
     * @memberof Interior
     */
    _id?: unknown;

    /**
     * The interior id for lookups.
     * This is automatically generated. Do not apply this.
     * @type {number}
     * @memberof IVehicle
     */
    id?: number;

    /**
     * The location for the outside entrance to the inside.
     * @type {Vector3}
     * @memberof Interior
     */
    outside: Vector3;

    /**
     * The location inside of an interior that leads to the outside.
     * @type {Vector3}
     * @memberof Interior
     */
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

    /**
     * The price of this interior if it is for sale.
     * @type {number}
     * @memberof Interior
     */
    price?: number;

    /**
     * The type of interior this is.
     * Use a single flag for this.
     * @type {INTERIOR_TYPES}
     * @memberof Interior
     */
    type: INTERIOR_TYPES;

    /**
     * The type of system(s) this interior has access to.
     * You can specify multiple flags. INTERIOR_SYSTEM.HAS_LOCK | INTERIOR_SYSTEM.HAS_OWNER
     * @type {INTERIOR_SYSTEM}
     * @memberof Interior
     */
    system: INTERIOR_SYSTEM;
}
