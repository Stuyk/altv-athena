---
description: Learn how to add vehicle rules.
---

# Vehicle Rules

Vehicle rules are a special set of rules you can apply to most vehicle functionality.

They determine whether or not an action can be completed on a vehicle.

## Vehicle Rule Types

```ts
enum VEHICLE_RULES {
    ENTER = 'vehicle-enter',
    EXIT = 'vehicle-exit',
    LOCK = 'vehicle-lock',
    UNLOCK = 'vehicle-unlock',
    STORAGE = 'vehicle-storage',
    ENGINE = 'vehicle-engine',
    DOOR = 'vehicle-door',
}
```

## Vehicle Rule Usage

_Remember you will need to import `VehicleSystem` and `VEHICLE_RULES` into your file_

```ts
// Define the rule and what rule to use.
VehicleSystem.addCustomRule(VEHICLE_RULES.ENTER, (player, vehicle, { seat }) => {
    // Probably not a 'faction' vehicle.
    if (!vehicle.data) {
        return { status: true, response: null };
    }

    // Vehicle is not a faction vehicle.
    if (!vehicle.data.faction) {
        return { status: true, response: null };
    }

    // Vehicle is a faction vehicle at this point.
    // Player is not in a faction.
    if (!player.data.faction) {
        return { status: false, response: null };
    }

    // Faction matches player's faction.
    if (player.data.faction === vehicle.data.faction) {
        return { status: true, response: null };
    }

    // Player is not in same faction as vehicle.
    return { status: false, response: 'You do not have keys for this faction vehicle.' };
});
```
