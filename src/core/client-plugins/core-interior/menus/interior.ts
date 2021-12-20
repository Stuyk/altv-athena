import * as alt from 'alt-client';
import { PushVehicle } from '../../../client/systems/push';
import { isAnyMenuOpen } from '../../../client/utility/menus';
import { IWheelItem, WheelMenu } from '../../../client/utility/wheelMenu';
import { PLAYER_SYNCED_META } from '../../../shared/enums/PlayerSynced';
import { InputOptionType, InputResult } from '../../../shared/interfaces/InputMenus';
import { InputView } from '../../../client/views/input';
import { INTERIOR_INTERACTIONS } from '../../../shared-plugins/core-interiors/enums';
import { Interior } from '../../../shared-plugins/core-interiors/interfaces';

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
    const playerIdentifier = alt.Player.local.getSyncedMeta(PLAYER_SYNCED_META.DATABASE_ID);
    const isOwner = interior.owner === playerIdentifier;

    const toggleLockFunc = () => {
        alt.emitServer(INTERIOR_INTERACTIONS.TOGGLE_LOCK, interior.uid);
    };

    // Ownership Related Menu Functions
    if (isOwner) {
        options.push({
            name: interior.isUnlocked ? '~o~Lock' : '~g~Unlock',
            callback: toggleLockFunc,
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
                            placeholder: '25000',
                        },
                    ],
                    callback: (results: InputResult[]) => {
                        // Re-show this menu if it fails to find the value.
                        if (results.length <= 0) {
                            InputView.setMenu(InputMenu);
                            return;
                        }

                        // Check that there is a result.
                        const data = results.find((x) => x && x.id === 'price');
                        if (!data) {
                            InputView.setMenu(InputMenu);
                            return;
                        }

                        alt.emitServer(INTERIOR_INTERACTIONS.SET_PRICE, interior.uid, parseInt(data.value));
                    },
                };

                InputView.setMenu(InputMenu);
            },
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
                            error: '3-24 Characters. No Special Characters.',
                        },
                    ],
                    callback: (results: InputResult[]) => {
                        // Re-show this menu if it fails to find the value.
                        if (results.length <= 0) {
                            InputView.setMenu(InputMenu);
                            return;
                        }

                        // Check that there is a result.
                        const data = results.find((x) => x && x.id === 'name');
                        if (!data) {
                            InputView.setMenu(InputMenu);
                            return;
                        }

                        alt.emitServer(INTERIOR_INTERACTIONS.SET_NAME, interior.uid, data.value);
                    },
                };

                InputView.setMenu(InputMenu);
            },
        });
    }

    if (!isOwner && interior.price >= 1) {
        options.push({
            name: `Purchase~n~~p~$${interior.price}`,
            callback: () => {
                alt.emitServer(INTERIOR_INTERACTIONS.PURCHASE, interior.uid);
            },
        });
    }

    if (interior.isUnlocked) {
        options.push({
            name: '~g~Enter',
            callback: () => {
                alt.emitServer(INTERIOR_INTERACTIONS.ENTER, interior.uid);
            },
        });
    }

    WheelMenu.create(`Interior: ${interior.uid}`, options, true);
}

function exitMenu(interior: Interior) {
    if (!initialCheck) {
        return;
    }

    const options: IWheelItem[] = [];

    const playerIdentifier = alt.Player.local.getSyncedMeta(PLAYER_SYNCED_META.DATABASE_ID);
    const isOwner = interior.owner === playerIdentifier;
    const toggleLockFunc = () => {
        alt.emitServer(INTERIOR_INTERACTIONS.TOGGLE_LOCK, interior.uid);
    };

    // Ownership Related Menu Functions
    if (isOwner) {
        options.push({
            name: interior.isUnlocked ? '~o~Lock' : '~g~Unlock',
            callback: toggleLockFunc,
        });

        options.push({
            name: 'Storage',
            callback: () => {
                alt.emitServer(INTERIOR_INTERACTIONS.STORAGE, interior.uid);
            },
        });
    }

    options.push({
        name: '~r~Exit',
        callback: () => {
            alt.emitServer(INTERIOR_INTERACTIONS.EXIT, interior.uid);
        },
    });

    WheelMenu.create(`Interior: ${interior.uid}`, options, true);
}

alt.onServer(INTERIOR_INTERACTIONS.SHOW_MENU, showMenu);
