---
description: Learn how to use Athena built-in events.
---

# What is an Athena Event?

An Athena Event is a baked in event that gets called when specific Athena based scripting functionality is met. An example would be when a player is respawned by the gamemode through the death event.

## How to use an Athena Event?

Inside of your `plugins` folder you can define them like this on server-side.

```ts
import * as alt from 'alt-server';
import { ATHENA_EVENTS_PLAYER, ATHENA_EVENTS_VEHICLE } from '../../server/enums/athena';
import { EventController } from '../../server/systems/athenaEvent';

EventController.onPlayer(ATHENA_EVENTS_PLAYER.DIED, (player: alt.Player) => {
    alt.log(`${player.data.name} has died.`);
});

EventController.onVehicle(ATHENA_EVENTS_VEHICLE.SPAWNED, (vehicle: alt.Vehicle) => {
    console.log(`A player owned vehicle was spawned.`);
});
```

Auto-completion in VSCode will assist you with the rest.
