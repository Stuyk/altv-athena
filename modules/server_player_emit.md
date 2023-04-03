---
title: Athena.player.emit
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### acceptDeclineEvent

::: tip Usage
Athena.player.emit.**acceptDeclineEvent**(`player`, `eventInfo`): `any`
:::

Prompt the user to accept / decline something.

They must react by holding up arrow to open the menu.

#### Example

```ts
function doSomething(player: alt.Player) {
    Athena.player.emit.acceptDeclineEvent(somePlayer, {
        question: 'Would you like to teleport to the beach?',
        onClientEvents: {
            accept: 'from-client-event-doSomething',
            decline: 'from-client-event-doNothing',
        },
    });
}

alt.onClient('from-client-event-doSomething', (player: alt.Player) => {
    //
});
alt.onClient('from-client-event-doNothing', (player: alt.Player) => {
    //
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `eventInfo` | `AcceptDeclineEvent` |  |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:724](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L724)

___

### animation

::: tip Usage
Athena.player.emit.**animation**(`player`, `dictionary`, `name`, `flags`, `duration?`): `void`
:::

Play an animation on this player.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `player` | `Player` | `undefined` |
| `dictionary` | `string` | `undefined` |
| `name` | `string` | `undefined` |
| `flags` | `ANIMATION_FLAGS` | `undefined` |
| `duration?` | `number` | `-1` |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:85](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L85)

___

### clearAnimation

::: tip Usage
Athena.player.emit.**clearAnimation**(`player`): `any`
:::

Used to clear an animation or a task.
Does not trigger if the player is in a vehicle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:111](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L111)

___

### clearCredits

::: tip Usage
Athena.player.emit.**clearCredits**(`player`): `any`
:::

Clears a 'credits' display.

#### Example
```ts
const uidFromAttachment = Athena.player.emit.clearCredits(somePlayer);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:522](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L522)

___

### clearErrorScreen

::: tip Usage
Athena.player.emit.**clearErrorScreen**(`player`): `any`
:::

Clear a full-screen message.

#### Example
```ts
Athena.player.emit.clearErrorScreen(somePlayer)
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:446](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L446)

___

### clearShard

::: tip Usage
Athena.player.emit.**clearShard**(`player`): `any`
:::

Clear a shard.

#### Example
```ts
Athena.player.emit.clearShard(somePlayer);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:483](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L483)

___

### clearSpinner

::: tip Usage
Athena.player.emit.**clearSpinner**(`player`): `any`
:::

Clear a spinner in the bottom-right corner.

No UID necessary since it can only have one spinner at a time.

#### Example
```ts
Athena.player.emit.clearSpinner(somePlayer);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:409](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L409)

___

### clearTimeCycleEffect

::: tip Usage
Athena.player.emit.**clearTimeCycleEffect**(`player`): `void`
:::

Used to clear a screen effect from a player.

#### Example
```ts
Athena.player.emit.clearTimeCycleEffect(somePlayer);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:794](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L794)

___

### createCredits

::: tip Usage
Athena.player.emit.**createCredits**(`player`, `credits`): `any`
:::

Create a 'credits' text aligned to a certain side of the screen.

Automatically clear(s) over-time.

#### Example
```ts
Athena.player.emit.createCredits(somePlayer, { name: 'Big Text', role: 'Small Text', duration: 2000 });
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `credits` | `ICredit` | - |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:504](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L504)

___

### createErrorScreen

::: tip Usage
Athena.player.emit.**createErrorScreen**(`player`, `screen`): `any`
:::

Create a full-screen message. Cannot be cleared by the player.

#### Example
```ts
Athena.player.emit.createErrorScreen(somePlayer, { title: 'Oh No!', text: 'Something Happened', text2: 'Maybe a suggestion', duration: 5000})
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `screen` | `IErrorScreen` |  |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:428](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L428)

___

### createMissionText

::: tip Usage
Athena.player.emit.**createMissionText**(`player`, `text`, `duration?`): `any`
:::

Create a subtitle on the bottom of the screen with optional duration.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `text` | `string` |  |
| `duration?` | `number` |  |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:215](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L215)

___

### createProgressBar

::: tip Usage
Athena.player.emit.**createProgressBar**(`player`, `progressbar`): `string`
:::

Create a progress bar that eventually ends itself.

#### Example
```ts
const someUid = Athena.player.emit.createProgressBar(somePlayer, {
     color: new alt.RGBA(255, 0, 0, 200),
     distance: 10,
     milliseconds: 30000,
     position: new alt.Vector3(somePlayer.pos.x, somePlayer.pos.y, somePlayer.pos.z)
});
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `progressbar` | `ProgressBar` |  |

#### Returns

`string`

A unique identifier to remove the progress bar.

#### Defined in

[server/player/emit.ts:240](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L240)

___

### createShard

::: tip Usage
Athena.player.emit.**createShard**(`player`, `shard`): `any`
:::

Create a full-screen shard. Similar to 'mission-passed' or 'wasted'.

#### Example
```ts
Athena.player.emit.createShard(somePlayer, { title: 'Big Text', text: 'Small Text', duration: 5000 })
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `shard` | `IShard` | - |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:465](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L465)

___

### createSpinner

::: tip Usage
Athena.player.emit.**createSpinner**(`player`, `spinner`): `any`
:::

Create a spinner in the bottom-right corner.

#### Example
```ts
Athena.player.emit.createSpinner(somePlayer, { text: 'Doing Something With Spinners', duration: 5000, type: 4 })
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `spinner` | `ISpinner` |  |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:389](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L389)

___

### fadeScreenFromBlack

::: tip Usage
Athena.player.emit.**fadeScreenFromBlack**(`player`, `timeInMs`): `void`
:::

Removes the black filter over the screen over time.

#### Example
```ts
Athena.player.emit.fadeScreenFromBlack(somePlayer, 5000);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `timeInMs` | `number` |  |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:759](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L759)

___

### fadeScreenToBlack

::: tip Usage
Athena.player.emit.**fadeScreenToBlack**(`player`, `timeInMs`): `void`
:::

Turns the player's screen black over time.

#### Example
```ts
Athena.player.emit.fadeScreenToBlack(somePlayer, 5000);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `timeInMs` | `number` |  |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:744](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L744)

___

### message

::: tip Usage
Athena.player.emit.**message**(`player`, `msg`): `any`
:::

Emit a message to a given player.

#### Example
```ts
Athena.player.emit.message(somePlayer, '{FF0000} Hello there! This text is Red :)');
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `msg` | `string` |  |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:687](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L687)

___

### meta

::: tip Usage
Athena.player.emit.**meta**(`player`, `key`, `value`): `void`
:::

Synchronize a local variable to access locally for this player.

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `key` | `string` |
| `value` | `any` |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:157](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L157)

___

### notification

::: tip Usage
Athena.player.emit.**notification**(`player`, `message`): `void`
:::

Send a notification to this player.

#### Example
```ts
Athena.player.emit.notification(somePlayer, '~y~Hello There~');
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `message` | `string` |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:177](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L177)

___

### objectAttach

::: tip Usage
Athena.player.emit.**objectAttach**(`player`, `attachable`, `removeAfterMilliseconds?`): `string` \| ``null``
:::

Attach an object to a player.

Automatically synchronized and handled client-side.

Last parameter is when to remove the object. Automatically set to infinite.

#### Example
```ts
const uidFromAttachment = Athena.player.emit.objectAttach(somePlayer, {
     model: 'prop_box_ammo01a',
     bone: 127,
     pos: { x: 0, y: 0, z: 0},
     rot: { x: 0, y: 0, z: 0 }
});
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `player` | `Player` | `undefined` | An alt:V Player Entity |
| `attachable` | `IAttachable` | `undefined` |  |
| `removeAfterMilliseconds` | `number` | `-1` |  |

#### Returns

`string` \| ``null``

UID for attachable object

#### Defined in

[server/player/emit.ts:552](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L552)

___

### objectRemove

::: tip Usage
Athena.player.emit.**objectRemove**(`player`, `uid`): `any`
:::

Remove an attachment object from the player.

#### Example
```ts
const uidFromAttachment = Athena.player.emit.objectAttach(somePlayer, {
     model: 'prop_box_ammo01a',
     bone: 127,
     pos: { x: 0, y: 0, z: 0},
     rot: { x: 0, y: 0, z: 0 }
});

Athena.player.emit.objectRemove(somePlayer, uidFromAttachment);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `uid` | `string` | A unique string |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:612](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L612)

___

### particle

::: tip Usage
Athena.player.emit.**particle**(`player`, `particle`, `emitToNearbyPlayers?`): `void`
:::

Play a particle effect at a specific coordinate.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `player` | `Player` | `undefined` |
| `particle` | `Particle` | `undefined` |
| `emitToNearbyPlayers?` | `boolean` | `false` |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:192](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L192)

___

### removeProgressBar

::: tip Usage
Athena.player.emit.**removeProgressBar**(`player`, `uid`): `any`
:::

Remove a progress bar based on its unique identifier.

#### Example
```ts
const someUid = Athena.player.emit.createProgressBar(somePlayer, {
     color: new alt.RGBA(255, 0, 0, 200),
     distance: 10,
     milliseconds: 30000,
     position: new alt.Vector3(somePlayer.pos.x, somePlayer.pos.y, somePlayer.pos.z)
});

Athena.player.emit.removeProgressBar(somePlayer, someUid);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `uid` | `string` | A unique string |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:271](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L271)

___

### scenario

::: tip Usage
Athena.player.emit.**scenario**(`player`, `name`, `duration`): `void`
:::

Play an animation on this player.

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `name` | `string` |
| `duration` | `number` |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:138](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L138)

___

### setTimeCycleEffect

::: tip Usage
Athena.player.emit.**setTimeCycleEffect**(`player`, `name`, `amountInMs`): `any`
:::

Used to apply on-screen effects to a given player.

Think of like screen wobbling, drunkness, etc.

#### Example
```ts
Athena.player.emit.setTimeCycleEffect(somePlayer, 'REDMIST', 30000);
```

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `name` | `RecommendedTimecycleTypes` |  |
| `amountInMs` | `number` | How long it should last. -1 for infinite. |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:763](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L763)

::: tip Usage
Athena.player.emit.**setTimeCycleEffect**(`player`, `name`, `amountInMs`): `any`
:::

Used to apply on-screen effects to a given player.

Think of like screen wobbling, drunkness, etc.

#### Example
```ts
Athena.player.emit.setTimeCycleEffect(somePlayer, 'REDMIST', 30000);
```

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `name` | `string` |  |
| `amountInMs` | `number` | How long it should last. -1 for infinite. |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:764](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L764)

___

### setWeather

::: tip Usage
Athena.player.emit.**setWeather**(`player`, `weather`, `timeInSeconds`): `void`
:::

Cleanly transition weather from current weather to a new weather type.

Does not use alt:V functionality. Only uses natives.

#### Example
```ts
Athena.player.emit.setWeather(somePlayer, 'Thunder', 30);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `weather` | `WEATHER_KEY` | - |
| `timeInSeconds` | `number` |  |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:811](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L811)

___

### sound2D

::: tip Usage
Athena.player.emit.**sound2D**(`player`, `audioName`, `volume?`, `soundInstantID?`): `any`
:::

Play a custom sound without any positional data.

#### Example
```ts
Athena.player.emit.sound3D(somePlayer, 'error.ogg');
```

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `player` | `Player` | `undefined` | An alt:V Player Entity |
| `audioName` | `string` | `undefined` |  |
| `volume?` | `number` | `0.35` |  |
| `soundInstantID?` | `string` | `undefined` | - |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:292](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L292)

___

### sound3D

::: tip Usage
Athena.player.emit.**sound3D**(`player`, `audioName`, `target`, `soundInstantID?`): `void`
:::

Play a sound from at a target's location for this player.

#### Example
```ts
Athena.player.emit.sound3D(somePlayer, 'car_lock.ogg', someVehicle);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `audioName` | `string` |
| `target` | `Entity` |
| `soundInstantID?` | `string` |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:313](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L313)

___

### soundFrontend

::: tip Usage
Athena.player.emit.**soundFrontend**(`player`, `audioName`, `ref`): `void`
:::

Play a frontend sound for this player.

[Frontend Audio List](https://github.com/DurtyFree/gta-v-data-dumps/blob/master/soundNames.json)

#### Example
```ts
Athena.player.emit.soundFrontend(somePlayer, 'HUD_FRONTEND_DEFAULT_SOUNDSET', 'BACK');
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `audioName` | `string` |
| `ref` | `string` |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:358](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L358)

___

### soundStop

::: tip Usage
Athena.player.emit.**soundStop**(`player`, `soundInstantID?`): `void`
:::

Stop all custom sounds that may be playing.

This does not stop frontend sounds.

#### Example
```ts
Athena.player.emit.soundStop(somePlayer);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `soundInstantID?` | `string` |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:336](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L336)

___

### startAlarm

::: tip Usage
Athena.player.emit.**startAlarm**(`player`, `name`): `void`
:::

Play an alarm on this player.
List of all alarms: https://github.com/DurtyFree/gta-v-data-dumps/blob/master/alarmSounds.json

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `name` | `string` |  |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:29](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L29)

___

### stopAlarm

::: tip Usage
Athena.player.emit.**stopAlarm**(`player`, `name`): `any`
:::

Stop an alarm for this player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `name` | `string` |  |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:48](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L48)

___

### stopAllAlarms

::: tip Usage
Athena.player.emit.**stopAllAlarms**(`player`): `any`
:::

Stop all alarms for this player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:64](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L64)

___

### taskTimeline

::: tip Usage
Athena.player.emit.**taskTimeline**(`player`, `tasks`): `any`
:::

Force the player to perform an uncancellable task timeline.

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `tasks` | `any`[] |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:370](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L370)

___

### tempObjectLerp

::: tip Usage
Athena.player.emit.**tempObjectLerp**(`player`, `model`, `start`, `end`, `speed`): `any`
:::

Allows a temporary object to be created and moved.
The object is only seen by this one player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `model` | `string` |  |
| `start` | `IVector3` |  |
| `end` | `IVector3` |  |
| `speed` | `number` |  |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:646](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L646)

___

### wheelMenu

::: tip Usage
Athena.player.emit.**wheelMenu**(`player`, `label`, `wheelItems`): `any`
:::

Create a wheel menu and emit  it to the player.
Can emit events to client or server-side.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `label` | `string` |  |
| `wheelItems` | `IWheelOption`[] |  |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:668](https://github.com/Stuyk/altv-athena/blob/1620176/src/core/server/player/emit.ts#L668)
