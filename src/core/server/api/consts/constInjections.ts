import { LoginInjections } from '../../systems/injections/login';
import { PlayerInjections } from '../../systems/injections/player';
import { VehicleInjection } from '../../systems/injections/vehicles';

export const injectionsConst = {
    login: LoginInjections,
    player: PlayerInjections,
    vehicle: VehicleInjection,
};
