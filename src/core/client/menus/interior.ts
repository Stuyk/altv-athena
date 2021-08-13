import * as alt from 'alt-client';
import * as native from 'natives';
import { Interior } from '../../shared/interfaces/Interior';
import { SYSTEM_EVENTS } from '../../shared/enums/system';
import { PushVehicle } from '../systems/push';
import { isAnyMenuOpen } from '../utility/menus';
import { IWheelItem, WheelMenu } from '../utility/wheelMenu';
import { PLAYER_SYNCED_META } from '../../shared/enums/playerSynced';
import { InputOptionType, InputResult } from '../../shared/interfaces/InputMenus';
import { InputView } from '../views/input';

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

        options.push({
            name: 'Set Sale Price',
            callback: () => {
                const InputMenu = {
                    title: 'Sale Price',
                    options: [
                        {
                            id: 'price',
                            desc: 'Price (Use -1 to Cancel Sale)',
                            type: InputOptionType.NUMBER,
                            placeholder: '25000'
                        }
                    ],
                    callback: (results: InputResult[]) => {
                        // Re-show this menu if it fails to find the value.
                        if (results.length <= 0) {
                            InputView.show(InputMenu);
                            return;
                        }

                        // Check that there is a result.
                        const data = results.find((x) => x && x.id === 'price');
                        if (!data) {
                            InputView.show(InputMenu);
                            return;
                        }

                        alt.emitServer(SYSTEM_EVENTS.INTERIOR_SET_PRICE, interior.id, parseInt(data.value));
                    }
                };

                InputView.show(InputMenu);
            }
        });

        options.push({
            name: 'Set House Name',
            callback: () => {
                const InputMenu = {
                    title: 'Set House Name',
                    options: [
                        {
                            id: 'name',
                            desc: 'Name to Display on House',
                            type: InputOptionType.TEXT,
                            placeholder: `Stuyks House`,
                            regex: '^[a-zA-Z0-9 ]{1,24}$', // Matches 3 to 24 Characters
                            error: '3-24 Characters. No Special Characters.'
                        }
                    ],
                    callback: (results: InputResult[]) => {
                        // Re-show this menu if it fails to find the value.
                        if (results.length <= 0) {
                            InputView.show(InputMenu);
                            return;
                        }

                        // Check that there is a result.
                        const data = results.find((x) => x && x.id === 'name');
                        if (!data) {
                            InputView.show(InputMenu);
                            return;
                        }

                        alt.emitServer(SYSTEM_EVENTS.INTERIOR_SET_NAME, interior.id, data.value);
                    }
                };

                InputView.show(InputMenu);
            }
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

        options.push({
            name: 'Storage',
            callback: () => {
                alt.emitServer(SYSTEM_EVENTS.INTERIOR_STORAGE, interior.id);
            }
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
