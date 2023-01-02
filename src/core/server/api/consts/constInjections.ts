import { LoginInjections } from '@AthenaServer/systems/injections/login';
import { PlayerInjections } from '@AthenaServer/systems/injections/player';
import { VehicleInjection } from '@AthenaServer/systems/injections/vehicles';

export const injectionsConst = {
    login: LoginInjections,
    player: PlayerInjections,
    vehicle: VehicleInjection,
};
