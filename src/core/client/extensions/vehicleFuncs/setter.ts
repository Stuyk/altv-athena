import * as alt from 'alt-client';
import { BaseHUD, HudEventNames } from '../../views/hud/hud';

function fuel(v: alt.Vehicle, value: number) {
    v.fuel = value;

    if (!alt.Player.local.vehicle) {
        return;
    }

    if (alt.Player.local.vehicle.id === v.id) {
        BaseHUD.setHudStatus(HudEventNames.Fuel, value);
    }
}

export default {
    fuel
};
