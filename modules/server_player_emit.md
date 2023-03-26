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
They must react by holding l-shift to open the menu.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `eventInfo` | `AcceptDeclineEvent` |  |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:560](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L560)

___

### animation

::: tip Usage
Athena.player.emit.**animation**(`player`, `dictionary`, `name`, `flags`, `duration?`): `void`
:::

Play an animation on this player.

**`Memberof`**

EmitPrototype

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

[server/player/emit.ts:85](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L85)

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

[server/player/emit.ts:111](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L111)

___

### clearCredits

::: tip Usage
Athena.player.emit.**clearCredits**(`player`): `any`
:::

Clears a 'credits' display.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:411](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L411)

___

### clearErrorScreen

::: tip Usage
Athena.player.emit.**clearErrorScreen**(`player`): `any`
:::

Clear a full-screen message.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:360](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L360)

___

### clearShard

::: tip Usage
Athena.player.emit.**clearShard**(`player`): `any`
:::

Clear a shard.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:385](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L385)

___

### clearSpinner

::: tip Usage
Athena.player.emit.**clearSpinner**(`player`): `any`
:::

Clear a spinner in the bottom-right corner.
No UID necessary since it can only have one spinner at a time.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:335](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L335)

___

### clearTimeCycleEffect

::: tip Usage
Athena.player.emit.**clearTimeCycleEffect**(`player`): `void`
:::

Used to clear a screen effect from a player.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:613](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L613)

___

### createCredits

::: tip Usage
Athena.player.emit.**createCredits**(`player`, `credits`): `any`
:::

Create a 'credits' text aligned to a certain side of the screen.
Automatically clear(s) over-time.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `credits` | `ICredit` | - |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:399](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L399)

___

### createErrorScreen

::: tip Usage
Athena.player.emit.**createErrorScreen**(`player`, `screen`): `any`
:::

Create a full-screen message. Cannot be cleared by the player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `screen` | `IErrorScreen` |  |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:348](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L348)

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

[server/player/emit.ts:206](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L206)

___

### createProgressBar

::: tip Usage
Athena.player.emit.**createProgressBar**(`player`, `progressbar`): `string`
:::

Create a progress bar that eventually ends itself.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `progressbar` | `ProgressBar` |  |

#### Returns

`string`

A unique identifier to remove the progress bar.

#### Defined in

[server/player/emit.ts:220](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L220)

___

### createShard

::: tip Usage
Athena.player.emit.**createShard**(`player`, `shard`): `any`
:::

Create a full-screen shard. Similar to 'mission-passed' or 'wasted'.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `shard` | `IShard` | - |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:373](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L373)

___

### createSpinner

::: tip Usage
Athena.player.emit.**createSpinner**(`player`, `spinner`): `any`
:::

Create a spinner in the bottom-right corner.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `spinner` | `ISpinner` |  |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:322](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L322)

___

### fadeScreenFromBlack

::: tip Usage
Athena.player.emit.**fadeScreenFromBlack**(`player`, `timeInMs`): `void`
:::

Removes the black filter over the screen over time.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `timeInMs` | `number` |  |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:587](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L587)

___

### fadeScreenToBlack

::: tip Usage
Athena.player.emit.**fadeScreenToBlack**(`player`, `timeInMs`): `void`
:::

Turns the player's screen black over time.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `timeInMs` | `number` |  |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:576](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L576)

___

### message

::: tip Usage
Athena.player.emit.**message**(`player`, `msg`): `any`
:::

Emit a message to a given player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `msg` | `string` |  |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:545](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L545)

___

### meta

::: tip Usage
Athena.player.emit.**meta**(`player`, `key`, `value`): `void`
:::

Synchronize a local variable to access locally for this player.

**`Memberof`**

EmitPrototype

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `key` | `string` |
| `value` | `any` |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:157](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L157)

___

### notification

::: tip Usage
Athena.player.emit.**notification**(`player`, `message`): `void`
:::

Send a notification to this player.

**`Memberof`**

EmitPrototype

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `message` | `string` |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:170](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L170)

___

### objectAttach

::: tip Usage
Athena.player.emit.**objectAttach**(`player`, `attachable`, `removeAfterMilliseconds?`): `string` \| ``null``
:::

Attach an object to a player.
Automatically synchronized and handled client-side.
Last parameter is when to remove the object. Automatically set to infinite.

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

[server/player/emit.ts:428](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L428)

___

### objectRemove

::: tip Usage
Athena.player.emit.**objectRemove**(`player`, `uid`): `any`
:::

Remove an object from the player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `uid` | `string` | A unique string |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:475](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L475)

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

[server/player/emit.ts:183](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L183)

___

### removeProgressBar

::: tip Usage
Athena.player.emit.**removeProgressBar**(`player`, `uid`): `any`
:::

Remove a progress bar based on its unique identifier.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `uid` | `string` | A unique string |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:238](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L238)

___

### scenario

::: tip Usage
Athena.player.emit.**scenario**(`player`, `name`, `duration`): `void`
:::

Play an animation on this player.

**`Memberof`**

EmitPrototype

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `name` | `string` |
| `duration` | `number` |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:138](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L138)

___

### setTimeCycleEffect

::: tip Usage
Athena.player.emit.**setTimeCycleEffect**(`player`, `name`, `amountInMs`): `any`
:::

Used to apply on-screen effects to a given player.

Think of like screen wobbling, drunkness, etc.

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

[server/player/emit.ts:591](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L591)

::: tip Usage
Athena.player.emit.**setTimeCycleEffect**(`player`, `name`, `amountInMs`): `any`
:::

Used to apply on-screen effects to a given player.

Think of like screen wobbling, drunkness, etc.

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

[server/player/emit.ts:592](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L592)

___

### setWeather

::: tip Usage
Athena.player.emit.**setWeather**(`player`, `weather`, `timeInSeconds`): `void`
:::

Cleanly transition weather from current weather to a new weather type.

Does not use alt:V functionality. Only uses natives.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `weather` | `WEATHER_KEY` | - |
| `timeInSeconds` | `number` |  |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:626](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L626)

___

### sound2D

::: tip Usage
Athena.player.emit.**sound2D**(`player`, `audioName`, `volume?`, `soundInstantID?`): `any`
:::

Play a sound without any positional data.

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

[server/player/emit.ts:253](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L253)

___

### sound3D

::: tip Usage
Athena.player.emit.**sound3D**(`player`, `audioName`, `target`, `soundInstantID?`): `void`
:::

Play a sound from at a target's location for this player.

**`Memberof`**

EmitPrototype

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

[server/player/emit.ts:268](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L268)

___

### soundFrontend

::: tip Usage
Athena.player.emit.**soundFrontend**(`player`, `audioName`, `ref`): `void`
:::

Play a frontend sound for this player.

**`Memberof`**

EmitPrototype

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `audioName` | `string` |
| `ref` | `string` |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:297](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L297)

___

### soundStop

::: tip Usage
Athena.player.emit.**soundStop**(`player`, `soundInstantID?`): `void`
:::

Stop all sounds.

**`Memberof`**

EmitPrototype

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `soundInstantID?` | `string` |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:283](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L283)

___

### startAlarm

::: tip Usage
Athena.player.emit.**startAlarm**(`player`, `name`): `void`
:::

Play an alarm on this player.
List of all alarms: https://github.com/DurtyFree/gta-v-data-dumps/blob/master/alarmSounds.json

**`Memberof`**

EmitPrototype

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `name` | `string` |  |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:29](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L29)

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

[server/player/emit.ts:48](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L48)

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

[server/player/emit.ts:64](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L64)

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

[server/player/emit.ts:309](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L309)

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

[server/player/emit.ts:509](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L509)

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

[server/player/emit.ts:531](https://github.com/Stuyk/altv-athena/blob/217ba5f/src/core/server/player/emit.ts#L531)
