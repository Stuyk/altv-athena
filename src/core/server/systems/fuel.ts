import * as alt from 'alt-server';
import { SHARED_CONFIG } from '../../shared/configurations/shared';
import { CurrencyTypes } from '../../shared/enums/currency';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { Vehicle_Behavior, Vehicle_State } from '../../shared/enums/vehicle';
import { isFlagEnabled } from '../../shared/utility/flags';
import { distance2d } from '../../shared/utility/vector';
import { playerFuncs } from '../extensions/Player';
import { getClosestEntity } from '../utility/vector';

alt.on(SYSTEM_EVENTS.INTERACTION_FUEL, handleFuel);

// player.id to retrieve
const maximumFuel = 100;
const fuelTimes: FuelStatus[] = [];

interface FuelStatus {
    id: number;
    vehicle: alt.Vehicle;
    endTime: number;
    maxCost: number;
    difFuel: number;
    timeout: number;
}

function handleFuel(player: alt.Player, pos: alt.IVector3) {
    if (player.vehicle) {
        playerFuncs.emit.notification(player, `~r~Exit your vehicle first.`);
        return;
    }

    if (!player.lastEnteredVehicleID) {
        playerFuncs.emit.notification(player, `~r~Enter and exit a vehicle first.`);
        return;
    }

    const index = fuelTimes.findIndex((fuelStatus) => fuelStatus.id === player.id);

    if (index !== -1) {
        handleFinishFuel(player, fuelTimes[index]);
        fuelTimes.splice(index, 1);
        return;
    }

    const lastVehicle = alt.Vehicle.all.find((v) => v.id === player.lastEnteredVehicleID);
    if (!lastVehicle) {
        playerFuncs.emit.notification(player, `~r~Could not find a close enough vehicle.`);
        return;
    }

    if (lastVehicle.fuel >= 95) {
        playerFuncs.emit.notification(player, `~r~Already close to maximum capacity.`);
        return;
    }

    if (distance2d(lastVehicle.pos, pos) > 3) {
        playerFuncs.emit.notification(player, `~r~Vehicle is too far away from pump.`);
        return;
    }

    if (isFlagEnabled(lastVehicle.behavior, Vehicle_Behavior.UNLIMITED_FUEL)) {
        playerFuncs.emit.notification(player, `~r~Vehicle does not need fuel.`);
        return;
    }

    if (player.data.cash <= 0) {
        playerFuncs.emit.notification(player, `~r~No cash on hand.`);
        return;
    }

    const currentFuel = lastVehicle.fuel;
    let missingFuel = maximumFuel - currentFuel;
    let maximumCost = missingFuel * SHARED_CONFIG.FUEL_PRICE;

    // re-calculate based on what the player can afford.
    if (player.data.cash < maximumCost) {
        maximumCost = SHARED_CONFIG.FUEL_PRICE * player.data.cash;
        missingFuel = missingFuel - SHARED_CONFIG.FUEL_PRICE * player.data.cash;

        if (missingFuel <= 2) {
            playerFuncs.emit.notification(player, `~r~You cannot afford any fuel.`);
            return;
        }
    }

    const missingFuelPct = (missingFuel / maximumFuel) * 100;
    const maximumTime = (SHARED_CONFIG.FUEL_TIME / 100) * missingFuelPct;
    playerFuncs.emit.notification(
        player,
        `You will pay $${maximumCost} for ${missingFuel} to top off. Press again to cancel.`
    );

    fuelTimes.push({
        id: player.id,
        endTime: Date.now() + maximumTime,
        difFuel: missingFuel,
        maxCost: maximumCost,
        vehicle: lastVehicle,
        timeout: alt.setTimeout(() => {
            handleFinishFuel(player, fuelTimes[player.id]);
        }, maximumTime)
    });
}

function handleFinishFuel(player: alt.Player, fuelStatus: FuelStatus) {
    alt.clearTimeout(fuelStatus.timeout);
    if (player.data.cash < fuelStatus.maxCost) {
        playerFuncs.emit.notification(player, `~r~You were unable to purchase fuel.`);
        return;
    }

    if (Date.now() >= fuelStatus.endTime) {
        playerFuncs.currency.sub(player, CurrencyTypes.CASH, fuelStatus.maxCost);
        fuelStatus.vehicle.fuel = 100;
        fuelStatus.vehicle.data.fuel = 100;
        fuelStatus.vehicle.setStreamSyncedMeta(Vehicle_State.FUEL, fuelStatus.vehicle.fuel);
        playerFuncs.emit.notification(player, `You paid ~r~$${fuelStatus.maxCost}~w~ for ${fuelStatus.difFuel} Units`);
        return;
    }

    const timeRemaining = fuelStatus.endTime - Date.now();
    const pctFuelTaken = timeRemaining / SHARED_CONFIG.FUEL_TIME;
    const totalFuel = pctFuelTaken * fuelStatus.difFuel;
    const totalCost = totalFuel * SHARED_CONFIG.FUEL_PRICE;

    if (totalCost <= 0) {
        playerFuncs.emit.notification(player, `~r~Something went wrong.`);
        return;
    }

    playerFuncs.currency.sub(player, CurrencyTypes.CASH, totalCost);
    fuelStatus.vehicle.fuel += totalFuel;
    fuelStatus.vehicle.data.fuel += totalFuel;

    if (fuelStatus.vehicle.fuel > 100) {
        fuelStatus.vehicle.fuel = 100;
    }

    if (fuelStatus.vehicle.data.fuel > 100) {
        fuelStatus.vehicle.data.fuel = 100;
    }

    fuelStatus.vehicle.setStreamSyncedMeta(Vehicle_State.FUEL, fuelStatus.vehicle.fuel);
    playerFuncs.emit.notification(player, `You paid $${totalCost} for ${totalFuel}`);
}
