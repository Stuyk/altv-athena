import * as alt from 'alt-server';
import * as Athena from '@AthenaServer/api/index.js';
import { VehicleDamage } from '@AthenaShared/interfaces/vehicleOwned.js';

function getDamageLevel(level: string): number {
    switch (level) {
        case 'DamagedLevel1':
            return 1;
        case 'DamagedLevel2':
            return 2;
        case 'DamagedLevel3':
            return 3;
        case 'NotDamaged':
            return 0;
        case 'Damaged':
            return 1;
        case 'None':
            return 2;
        default:
            return 0;
    }
}

function getVehiclePart(part: string): number {
    switch (part) {
        case 'FrontLeft':
            return 0;
        case 'FrontRight':
            return 1;
        case 'MiddleLeft':
            return 2;
        case 'MiddleRight':
            return 3;
        case 'RearLeft':
            return 4;
        case 'RearRight':
            return 5;
        case 'FrontBumper':
            return 0;
        case 'RearBumper':
            return 1;
        case 'PassSideFront':
            return 0;
        case 'DriverSideFront':
            return 1;
        case 'PassSideFront':
            return 2;
        case 'PassSideRear':
            return 3;
        case 'FrontWindshield':
            return 6;
        case 'RearWindshield':
            return 7;
        default:
            return 0;
    }
}

/**
 * Returns vehicle damage for individual parts.
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return {(VehicleDamage | undefined)}
 */
export function get(vehicle: alt.Vehicle): VehicleDamage | undefined {
    if (!vehicle?.valid) {
        return undefined;
    }

    let wheels = [];

    for (let w = 0; w < vehicle.wheelsCount; w++) {
        wheels[w] = {
            damageLevel: vehicle.getWheelHealth(w).toString(),
        };
    }

    return {
        parts: {
            FrontLeft: {
                bulletHoles: vehicle.getPartBulletHoles(0),
                damageLevel: vehicle.getPartDamageLevel(0).toString(),
            },
            FrontRight: {
                bulletHoles: vehicle.getPartBulletHoles(1),
                damageLevel: vehicle.getPartDamageLevel(1).toString(),
            },
            MiddleLeft: {
                bulletHoles: vehicle.getPartBulletHoles(2),
                damageLevel: vehicle.getPartDamageLevel(2).toString(),
            },
            MiddleRight: {
                bulletHoles: vehicle.getPartBulletHoles(3),
                damageLevel: vehicle.getPartDamageLevel(3).toString(),
            },
            RearLeft: {
                bulletHoles: vehicle.getPartBulletHoles(4),
                damageLevel: vehicle.getPartDamageLevel(4).toString(),
            },
            RearRight: {
                bulletHoles: vehicle.getPartBulletHoles(5),
                damageLevel: vehicle.getPartDamageLevel(5).toString(),
            },
        },
        windows: {
            DriverSideFront: {
                damageLevel: vehicle.isWindowDamaged(1) ? '1' : '0',
            },
            DriverSideRear: {
                damageLevel: vehicle.isWindowDamaged(3) ? '1' : '0',
            },
            PassSideFront: {
                damageLevel: vehicle.isWindowDamaged(0) ? '1' : '0',
            },
            PassSideRear: {
                damageLevel: vehicle.isWindowDamaged(2) ? '1' : '0',
            },
            FrontWindshield: {
                damageLevel: vehicle.isWindowDamaged(6) ? '1' : '0',
            },
            RearWindshield: {
                damageLevel: vehicle.isWindowDamaged(7) ? '1' : '0',
            },
        },
        bumpers: {
            FrontBumper: {
                damageLevel: vehicle.getBumperDamageLevel(0).toString(),
            },
            RearBumper: {
                damageLevel: vehicle.getBumperDamageLevel(1).toString(),
            },
        },
        wheels: wheels,
        lights: [],
    };
}

/**
 * Apply vehicle damage to a vehicle.
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @param {VehicleDamage} damage
 * @return {Promise<void>}
 */
export function apply(vehicle: alt.Vehicle, damage: VehicleDamage): void {
    if (damage.parts) {
        for (let part in damage.parts) {
            const damages = damage.parts[part];
            const vehPart = getVehiclePart(part);
            vehicle.setPartBulletHoles(vehPart, damages.bulletHoles);
            vehicle.setPartDamageLevel(vehPart, getDamageLevel(damages.damageLevel));
        }
    }

    if (damage.windows) {
        for (let part in damage.windows) {
            const damages = damage.windows[part];
            const vehPart = getVehiclePart(part);
            vehicle.setWindowDamaged(vehPart, parseInt(damages.damageLevel) >= 1 ? true : false);
        }
    }

    if (damage.bumpers) {
        for (let part in damage.bumpers) {
            const damages = damage.bumpers[part];
            const vehPart = getVehiclePart(part);
            vehicle.setBumperDamageLevel(vehPart, getDamageLevel(damages.damageLevel));
        }
    }

    if (damage.wheels) {
        for (let w = 0; w < damage.wheels.length; w++) {
            vehicle.setWheelHealth(w, parseInt(damage.wheels[w].damageLevel));
        }
    }
}

/**
 * Used to repair all vehicle damage, and save changes to the Database.
 *
 *
 * @param {alt.Vehicle} vehicle An alt:V Vehicle Entity
 * @return {void}
 */
export async function repair(vehicle: alt.Vehicle) {
    const damage = get(vehicle);

    // Repair Cosmetic Damages
    if (damage.parts) {
        for (let part in damage.parts) {
            const vehPart = getVehiclePart(part);
            vehicle.setPartBulletHoles(vehPart, 0);
            vehicle.setPartDamageLevel(vehPart, 0);
        }
    }

    // Repair Windows
    if (damage.windows) {
        for (let part in damage.windows) {
            const vehPart = getVehiclePart(part);
            vehicle.setWindowDamaged(vehPart, false);
        }
    }

    // Repair Bumpers
    if (damage.bumpers) {
        for (let part in damage.bumpers) {
            const vehPart = getVehiclePart(part);
            vehicle.setBumperDamageLevel(vehPart, 0);
        }
    }

    // Repair Wheels
    if (damage.wheels) {
        for (let w = 0; w < damage.wheels.length; w++) {
            vehicle.setWheelHealth(w, 1000);
        }
    }

    vehicle.engineHealth = 1000;
    vehicle.bodyHealth = 1000;
    vehicle.repair();

    const data = Athena.document.vehicle.get(vehicle);
    if (typeof data === 'undefined') {
        Athena.events.vehicle.trigger('vehicle-repaired', vehicle);
        return;
    }

    const newDamage = get(vehicle);
    await Athena.document.vehicle.set(vehicle, 'damage', newDamage);
    Athena.events.vehicle.trigger('vehicle-repaired', vehicle);
}
