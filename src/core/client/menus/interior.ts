import * as alt from 'alt-client';
import * as native from 'natives';
import { Interior } from '../../shared/interfaces/Interior';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { PushVehicle } from '../systems/push';
import { isAnyMenuOpen } from '../utility/menus';
import { IWheelItem, WheelMenu } from '../utility/wheelMenu';
import { PLAYER_SYNCED_META } from '../../shared/enums/playerSynced';

function initialCheck(): boolean {
    if (alt.Player.local.vehicle) {
        return false;
    }

    if (isAnyMenuOpen()) {
        return false;
    }

    if (PushVehicle.isPushing()) {
        return false;
    }

    return true;
}

function showMenu(interior: Interior, isOutside: boolean = true) {
    if (isOutside) {
        enterMenu(interior);
        return;
    }

    exitMenu(interior);
}

function enterMenu(interior: Interior) {
    if (!initialCheck) {
        return;
    }

    const options: IWheelItem[] = [];
    const isOwner = interior.owners.find((x) => x === alt.Player.local.getSyncedMeta(PLAYER_SYNCED_META.DATABASE_ID));
    const toggleLockFunc = () => {
        alt.emitServer(SYSTEM_EVENTS.INTERIOR_TOGGLE_LOCK, interior.id);
    };

    // Ownership Related Menu Functions
    if (isOwner) {
        options.push({
            name: interior.isUnlocked ? '~o~Lock' : '~g~Unlock',
            callback: toggleLockFunc
        });
    }

    if (!isOwner && interior.price >= 1) {
        options.push({
            name: `Purchase~n~~p~$${interior.price}`,
            callback: () => {
                alt.emitServer(SYSTEM_EVENTS.INTERIOR_PURCHASE, interior.id);
            }
        });
    }

    if (interior.isUnlocked) {
        options.push({
            name: '~g~Enter',
            callback: () => {
                alt.emitServer(SYSTEM_EVENTS.INTERIOR_ENTER, interior.id);
            }
        });
    }

    WheelMenu.create(`Interior: ${interior.id}`, options, true);
}

function exitMenu(interior: Interior) {
    if (!initialCheck) {
        return;
    }

    const options: IWheelItem[] = [];
    const isOwner = interior.owners.find((x) => x === alt.Player.local.getSyncedMeta(PLAYER_SYNCED_META.DATABASE_ID));
    const toggleLockFunc = () => {
        alt.emitServer(SYSTEM_EVENTS.INTERIOR_TOGGLE_LOCK, interior.id);
    };

    // Ownership Related Menu Functions
    if (isOwner) {
        options.push({
            name: interior.isUnlocked ? '~o~Lock' : '~g~Unlock',
            callback: toggleLockFunc
        });
    }

    options.push({
        name: '~r~Exit',
        callback: () => {
            alt.emitServer(SYSTEM_EVENTS.INTERIOR_EXIT, interior.id);
        }
    });

    WheelMenu.create(`Interior: ${interior.id}`, options, true);
}

alt.onServer(SYSTEM_EVENTS.INTERIOR_SHOW_MENU, showMenu);
