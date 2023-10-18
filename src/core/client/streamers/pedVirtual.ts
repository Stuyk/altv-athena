import * as alt from 'alt-client';
import * as native from 'natives';

import { playPedAnimation } from '@AthenaClient/systems/animations.js';
import { NET_OWNER_PED } from '@AthenaShared/enums/netOwner.js';
import { Animation } from '@AthenaShared/interfaces/animation.js';

alt.onServer(NET_OWNER_PED.ANIMATE, (ped: alt.Ped, animation: Animation) => {
    playPedAnimation(ped.scriptID, animation.dict, animation.name, animation.flags, animation.duration);
});

alt.onServer(NET_OWNER_PED.GOTO, (ped: alt.Ped, pos: alt.Vector3) => {
    native.taskGoStraightToCoord(ped.scriptID, pos.x, pos.y, pos.z, 10, -1, 0, 0);
});

alt.onServer(NET_OWNER_PED.FOLLOW, (ped: alt.Ped, target: alt.Player) => {
    native.taskGoToEntity(ped.scriptID, target.scriptID, -1, 1, 10, 1073741824.0, 0);
    native.setPedKeepTask(ped.scriptID, true);
});

alt.onServer(NET_OWNER_PED.UNFOLLOW, (ped: alt.Ped, target: alt.Player) => {
    native.clearPedTasksImmediately(ped.scriptID);
});

alt.onServer(NET_OWNER_PED.ENTER_VEHICLE, async (ped: alt.Ped, vehicle: alt.Vehicle, seat: number) => {
    await alt.Utils.waitFor(() => native.isPedInAnyVehicle(ped.scriptID, false) == false, 10000);
    native.taskEnterVehicle(ped.scriptID, vehicle.scriptID, -1, seat, 2, 1, '');
});

alt.onServer(NET_OWNER_PED.LEAVE_VEHICLE, (ped: alt.Ped) => {
    if (!native.isPedInAnyVehicle(ped.scriptID, false)) {
        return;
    }

    native.taskLeaveAnyVehicle(ped.scriptID, 0, 1);
});
