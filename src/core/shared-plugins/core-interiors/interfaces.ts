import { IObject } from '../../shared/interfaces/IObject';
import { Vector3 } from '../../shared/interfaces/Vector';
import { INTERIOR_SYSTEM } from './flags';

export interface Interior {
    /**
     * The database entry id for this interior
     * @type {unknown}
     * @memberof Interior
     */
    _id?: unknown;

    /**
     * A unique identifier for this interior.
     * It can be any string but there is an automatic generator if this is not supplied.
     *
     * @type {string}
     * @memberof Interior
     */
    uid?: string;

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
     * The owner of this property.
     * @type {string}
     * @memberof Interior
     */
    owner?: string;

    /**
     * A list of unique identifiers to create 'keys' for this interior.
     * @type {Array<string>}
     * @memberof Interior
     */
    keys?: Array<string>;

    /**
     * A list of faction ids who own have access to this property.
     * @type {Array<string>}
     * @memberof Interior
     */
    factions?: Array<string>;

    /**
     * The associated storage container with this interior.
     * @type {string}
     * @memberof Interior
     */
    storage?: string;

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
     * The type of system(s) this interior has access to.
     * You can specify multiple flags. INTERIOR_SYSTEM.HAS_LOCK | INTERIOR_SYSTEM.HAS_OWNER
     * @type {INTERIOR_SYSTEM}
     * @memberof Interior
     */
    system: INTERIOR_SYSTEM;
}
