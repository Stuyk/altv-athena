/**
 *
 * @ignore
 *
 * @enum {number}
 */
export const enum VEHICLE_CLASS {
    BOAT = 'boat',
    COMMERCIAL = 'commercial',
    COMPACT = 'compact',
    COUPE = 'coupe',
    CYCLE = 'cycle',
    EMERGENCY = 'emergency',
    HELICOPTER = 'helicopter',
    INDUSTRIAL = 'industrial',
    MILITARY = 'military',
    MOTORCYCLE = 'motorcycle',
    MUSCLE = 'muscle',
    OFF_ROAD = 'off_road',
    OPEN_WHEEL = 'open_wheel',
    PLANE = 'plane',
    RAIL = 'rail',
    SEDAN = 'sedan',
    SERVICE = 'service',
    SPORT = 'sport',
    SPORT_CLASSIC = 'sport_classic',
    SUPER = 'super',
    SUV = 'suv',
    UTILITY = 'utility',
    VAN = 'van',
}

export const enum VEHICLE_TYPE {
    AMPHIBIOUS_AUTOMOBILE = 'amphibious_automobile',
    AMPHIBIOUS_QUADBIKE = 'amphibious_quadbike',
    BICYCLE = 'bicycle',
    BIKE = 'bike',
    BLIMP = 'blimp',
    BOAT = 'boat',
    CAR = 'car',
    HELI = 'heli',
    PLANE = 'plane',
    QUADBIKE = 'quadbike',
    SUBMARINE = 'submarine',
    SUBMARINECAR = 'submarinecar',
    TRAILER = 'trailer',
    TRAIN = 'train',
}

export function isVehicleType(type: string, vehicleType: VEHICLE_TYPE): boolean {
    return type === vehicleType;
}

export enum FUEL_TYPE {
    NONE = 'none',
    GAS = 'gas',
    DIESEL = 'diesel',
    ELECTRIC = 'electric',
    JET_FUEL = 'jetfuel',
}
