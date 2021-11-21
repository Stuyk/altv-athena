# Adding Custom Streamers

A custom streamer is something that will allow you to synchronize a static object, pedestrian, etc. in the world for all player(s) to see. It inheritely uses the streaming service that is provided by the Athena Framework.

You can use it for something like synchronizing a door state.

## How does it Work?

You create a custom keyword for a streamer service.

That keyword is then used to call a function inside of your own custom streamer.

The custom function inside of your streamer will come back with the player and the stream data near the player of this specific type. In the instance below it would have a bunch of doors that are close to the user.

You can then take the data and pass it client-side and do something with it.

This makes synchronizing custom things very easy for static object(s).

## Basic Custom Streamer

_Imports may vary_

```typescript
import * as alt from 'alt-server';

import { sha256Random } from '../utility/encryption';
import { StreamerService } from './streamer';

const globalDoors: Array<IDoorState> = [];
const STREAM_RANGE = 25;
const KEY = 'doors';

interface IDoorState {
    uid?: string;

    /**
     * Position of the Object in a 3D space.
     * @type {Vector3}
     * @memberof IDoorState
     */
    pos: Vector3;

    /**
     * Some custom data for door state...
     * Add whatever you want...
     */
    isOpen?: boolean;
}

export class DoorController {
    /**
     * Initializes the streamer to use this callback to update players.
     */
    static init() {
        StreamerService.registerCallback(KEY, DoorController.update, STREAM_RANGE);
    }

    /**
     * Called when stream data is updated for this type.
     */
    static update(player: alt.Player, doors: Array<IDoorState>) {
        alt.emitClient(player, 'populate:Doors', doors);
    }

    /**
     * Call this when you add / remove global stream data.
     */
    static refresh() {
        StreamerService.updateData(KEY, globalDoors);
    }

    /**
     * Call this when you want to add new stream data.
     */
    static append(doorData: IDoorState): string {
        if (!doorData.uid) {
            doorData.uid = sha256Random(JSON.stringify(doorData));
        }

        globalDoors.push(doorData);
        DoorController.refresh();
        return doorData.uid;
    }
}

DoorController.init();
```
