import * as alt from 'alt-shared';

export interface WebViewPlayerState {
    health: number;
    armour: number;
    weapon: number;
    speed: number;
    stamina: number;
    pos: alt.IVector3;
    rot: alt.IVector3;
    micLevel: number;
    isTalking: boolean;
    isAiming: boolean;
    inVehicle: boolean;
    isDriver: boolean;
}
