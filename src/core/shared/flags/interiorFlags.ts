/**
 * Flags that apply to this interior.
 * Can be combined to create different types of interior(s).
 * @export
 * @enum {number}
 */
export enum INTERIOR_SYSTEM {
    NONE = 0,
    HAS_LOCK = 1,
    HAS_OWNER = 2,
    HAS_STORAGE = 4,
    HAS_PRICE = 8
}

/**
 * The type of interior this is.
 * @export
 * @enum {number}
 */
export enum INTERIOR_TYPES {
    NONE = 0,
    HOUSE = 1,
    FACTION = 2,
    BUSINESS = 4,
    SYSTEM = 8
}
