import alt from 'alt-client';
import natives from 'natives';

class CayoPerico {
    private readonly _islandCenter = new alt.Vector3(4840.571, -5174.425, 2.0);
    private _nearIsland: boolean = false;
    private _everyTick: number | undefined;

    constructor() {
        this.updateRadar = this.updateRadar.bind(this);

        alt.setInterval(this.checkRange.bind(this), 2_000);
        this.checkRange();
    }

    private checkRange() {
        const distance = alt.Player.local.pos.distanceTo(this._islandCenter);
        const nearIsland = distance <= 2_000;

        if (nearIsland == this._nearIsland) return;
        this._nearIsland = nearIsland;

        natives.setIslandHopperEnabled('HeistIsland', nearIsland);
        natives.setScenarioGroupEnabled('Heist_Island_Peds', nearIsland);
        natives.setAudioFlag('PlayerOnDLCHeist4Island', nearIsland);
        natives.setAmbientZoneListStatePersistent('AZL_DLC_Hei4_Island_Zones', false, nearIsland);
        natives.setAmbientZoneListStatePersistent('AZL_DLC_Hei4_Island_Disabled_Zones', false, nearIsland);

        if (nearIsland && this._everyTick == undefined) {
            this._everyTick = alt.everyTick(this.updateRadar);
            return;
        }

        if (!nearIsland && this._everyTick != undefined) {
            alt.clearEveryTick(this._everyTick);
            delete this._everyTick;
        }
    }

    private updateRadar() {
        natives.setRadarAsExteriorThisFrame();
        natives.setRadarAsInteriorThisFrame(alt.hash('h4_fake_islandx'), 4700.0, -5145.0, 0, 0);
    }
}

export default new CayoPerico();
