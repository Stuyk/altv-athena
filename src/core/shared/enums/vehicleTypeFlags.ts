export const enum VEHICLE_CLASS {
    BOAT = 'boat',
    SPEED_BOAT = 'speedboat',
    COMMERCIAL = 'commercial',
    COMPACT = 'compact',
    COUPE = 'coupe',
    CYCLE = 'cycle',
    EMERGENCY = 'emergency',
    INDUSTRIAL = 'industrial',
    MILITARY = 'military',
    MOTORCYCLE = 'motorcycle',
    MUSCLE = 'muscle',
    OFFROAD = 'offroad',
    OPENWHEEL = 'openwheel',
    AIRCRAFT = 'aircraft',
    SUV = 'suv',
    SEDAN = 'sedan',
    SERVICE = 'service',
    SPORT = 'sport',
    SPORT_CLASSIC = 'sportclassic',
    SUPER = 'super',
    TRAILER = 'trailer',
    TRAIN = 'train',
    UTILITY = 'utility',
    VAN = 'van',
}

export const enum VEHICLE_TYPE {
    BOAT = 'boat',
    AIRCRAFT = 'aircraft',
    VEHICLE = 'vehicle',
    TRAIN = 'train',
}

export function isVehicleType(type: string, vehicleType: VEHICLE_TYPE): boolean {
    return type === vehicleType;
}
