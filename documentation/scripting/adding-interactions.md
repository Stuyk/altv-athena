---
description: Learn how to add interactions.
---

- [What is an Interaction?](#what-is-an-interaction)
- [Video Guide](#video-guide)
- [Creation](#creation)
- [Removal](#removal)

# What is an Interaction?

An interaction is an invisible position on the map where if a player walks over this spot they may press their interaction button to trigger something. This can be anything from a menu, text, etc.

Keep in mind that Interactions are **GLOBAL** which means all players can access them. However, you can write an `if` statement inside of the intraction trigger to prevent the code from going further.

All interactions are `server-side` so if you want it to trigger `client-side` you will need to emit an event to the client to trigger it. This will ensure that interaction(s) are synced through `server-side` first.

# Video Guide

[![Interaction Video Guide](https://img.youtube.com/vi/O2aSiXwXoro/0.jpg)](https://www.youtube.com/watch?v=O2aSiXwXoro)

# Creation

This will create a ColShape where the player can press their interaction button to trigger something.

_Keep in mind that the paths of these files may vary._

```ts
import * as alt from 'alt-server';

import { playerFuncs } from '../../server/extensions/Player';
import { InteractionController } from '../../server/systems/interaction';

function doThisWhenInteractionIsPressed(player: alt.Player) {
    playerFuncs.emit.message(player, 'Nice!');
}

function GenerateInteractions() {
    InteractionController.add({
        uid: 'interaction-do-something',
        type: 'interaction:DoSomething',
        position: { x: 402.397308, y: -1029.67, z: 29.34688 },
        description: 'Neato',
        callback: doThisWhenInteractionIsPressed
    });
}

GenerateInteractions();
```

# Removal

This will remove an interaction and its associated ColShape.

_Keep in mind that the paths of these files may vary._

```ts
import * as alt from 'alt-server';

import { playerFuncs } from '../../server/extensions/Player';
import { InteractionController } from '../../server/systems/interaction';

const UID = 'do-something';
const INT_TYPE = 'interaction:DoSomething';

function doThisWhenInteractionIsPressed(player: alt.Player) {
    playerFuncs.emit.message(player, 'Removing Interaction!');
    InteractionController.remove(INT_TYPE, UID);
}

function GenerateInteractions() {
    InteractionController.add({
        uid: UID,
        type: INT_TYPE,
        position: { x: 402.397308, y: -1029.67, z: 29.34688 },
        description: 'Remove this interaction on press.',
        callback: doThisWhenInteractionIsPressed
    });
}

GenerateInteractions();
```