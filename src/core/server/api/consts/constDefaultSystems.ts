import { DefaultAmmoSystem } from '@AthenaServer/systems/defaults/ammo';
import { DefaultDeathSystem } from '@AthenaServer/systems/defaults/death';
import { DefaultHospitalBlips } from '@AthenaServer/systems/defaults/hospitalBlips';
import { DefaultInventorySystem } from '@AthenaServer/systems/defaults/inventory';
import { DefaultTimeSystem } from '@AthenaServer/systems/defaults/time';
import { DefaultToolbarSystem } from '@AthenaServer/systems/defaults/toolbar';
import { DefaultWeaponItemsSystem } from '@AthenaServer/systems/defaults/weaponItems';
import { DefaultWeatherSystem } from '@AthenaServer/systems/defaults/weather';

export const defaultSystemsConst = {
    ammo: DefaultAmmoSystem,
    blips: {
        hospital: DefaultHospitalBlips,
    },
    death: DefaultDeathSystem,
    inventory: DefaultInventorySystem,
    time: DefaultTimeSystem,
    toolbar: DefaultToolbarSystem,
    weaponItems: DefaultWeaponItemsSystem,
    weather: DefaultWeatherSystem,
};
