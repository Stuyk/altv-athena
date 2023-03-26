---
title: Athena.player.emit
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### acceptDeclineEvent

▸ **acceptDeclineEvent**(`player`, `eventInfo`): `any`

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

[server/player/emit.ts:569](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L569)

___

### animation

▸ **animation**(`player`, `dictionary`, `name`, `flags`, `duration?`): `void`

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

[server/player/emit.ts:86](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L86)

___

### clearAnimation

▸ **clearAnimation**(`player`): `any`

Used to clear an animation or a task.
Does not trigger if the player is in a vehicle.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:112](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L112)

___

### clearCredits

▸ **clearCredits**(`player`): `any`

Clears a 'credits' display.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:420](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L420)

___

### clearErrorScreen

▸ **clearErrorScreen**(`player`): `any`

Clear a full-screen message.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:369](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L369)

___

### clearShard

▸ **clearShard**(`player`): `any`

Clear a shard.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:394](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L394)

___

### clearSpinner

▸ **clearSpinner**(`player`): `any`

Clear a spinner in the bottom-right corner.
No UID necessary since it can only have one spinner at a time.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:344](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L344)

___

### clearTimeCycleEffect

▸ **clearTimeCycleEffect**(`player`): `void`

Used to clear a screen effect from a player.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`void`

#### Defined in

[server/player/emit.ts:622](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L622)

___

### createCredits

▸ **createCredits**(`player`, `credits`): `any`

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

[server/player/emit.ts:408](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L408)

___

### createErrorScreen

▸ **createErrorScreen**(`player`, `screen`): `any`

Create a full-screen message. Cannot be cleared by the player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `screen` | `IErrorScreen` |  |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:357](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L357)

___

### createMissionText

▸ **createMissionText**(`player`, `text`, `duration?`): `any`

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

[server/player/emit.ts:207](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L207)

___

### createProgressBar

▸ **createProgressBar**(`player`, `progressbar`): `string`

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

[server/player/emit.ts:221](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L221)

___

### createShard

▸ **createShard**(`player`, `shard`): `any`

Create a full-screen shard. Similar to 'mission-passed' or 'wasted'.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `shard` | `IShard` | - |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:382](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L382)

___

### createSpinner

▸ **createSpinner**(`player`, `spinner`): `any`

Create a spinner in the bottom-right corner.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `spinner` | `ISpinner` |  |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:331](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L331)

___

### fadeScreenFromBlack

▸ **fadeScreenFromBlack**(`player`, `timeInMs`): `void`

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

[server/player/emit.ts:596](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L596)

___

### fadeScreenToBlack

▸ **fadeScreenToBlack**(`player`, `timeInMs`): `void`

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

[server/player/emit.ts:585](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L585)

___

### inputMenu

▸ **inputMenu**(`player`, `inputMenu`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `inputMenu` | `InputMenu` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:318](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L318)

___

### message

▸ **message**(`player`, `msg`): `any`

Emit a message to a given player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `msg` | `string` |  |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:554](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L554)

___

### meta

▸ **meta**(`player`, `key`, `value`): `void`

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

[server/player/emit.ts:158](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L158)

___

### notification

▸ **notification**(`player`, `message`): `void`

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

[server/player/emit.ts:171](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L171)

___

### objectAttach

▸ **objectAttach**(`player`, `attachable`, `removeAfterMilliseconds?`): `string` \| ``null``

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

[server/player/emit.ts:437](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L437)

___

### objectRemove

▸ **objectRemove**(`player`, `uid`): `any`

Remove an object from the player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `uid` | `string` | A unique string |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:484](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L484)

___

### override

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"acceptDeclineEvent"`` |
| `callback` | (`player`: `Player`, `eventInfo`: `AcceptDeclineEvent`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:680](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L680)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"animation"`` |
| `callback` | (`player`: `Player`, `dictionary`: `string`, `name`: `string`, `flags`: `ANIMATION_FLAGS`, `duration?`: `number`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:681](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L681)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"clearAnimation"`` |
| `callback` | (`player`: `Player`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:682](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L682)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"clearCredits"`` |
| `callback` | (`player`: `Player`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:683](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L683)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"clearTimeCycleEffect"`` |
| `callback` | (`player`: `Player`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:684](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L684)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"createErrorScreen"`` |
| `callback` | (`player`: `Player`, `screen`: `IErrorScreen`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:685](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L685)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"createMissionText"`` |
| `callback` | (`player`: `Player`, `text`: `string`, `duration?`: `number`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:686](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L686)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"createProgressBar"`` |
| `callback` | (`player`: `Player`, `progressbar`: `ProgressBar`) => `string` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:687](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L687)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"createShard"`` |
| `callback` | (`player`: `Player`, `shard`: `IShard`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:688](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L688)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"createSpinner"`` |
| `callback` | (`player`: `Player`, `spinner`: `ISpinner`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:689](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L689)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"inputMenu"`` |
| `callback` | (`player`: `Player`, `inputMenu`: `InputMenu`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:690](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L690)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"fadeScreenFromBlack"`` |
| `callback` | (`player`: `Player`, `timeInMs`: `number`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:691](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L691)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"fadeScreenToBlack"`` |
| `callback` | (`player`: `Player`, `timeInMs`: `number`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:692](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L692)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"message"`` |
| `callback` | (`player`: `Player`, `msg`: `string`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:693](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L693)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"meta"`` |
| `callback` | (`player`: `Player`, `key`: `string`, `value`: `any`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:694](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L694)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"notification"`` |
| `callback` | (`player`: `Player`, `message`: `string`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:695](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L695)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"objectAttach"`` |
| `callback` | (`player`: `Player`, `attachable`: `IAttachable`, `removeAfterMilliseconds`: `number`) => `string` \| ``null`` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:696](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L696)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"objectRemove"`` |
| `callback` | (`player`: `Player`, `uid`: `string`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:697](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L697)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"particle"`` |
| `callback` | (`player`: `Player`, `particle`: `Particle`, `emitToNearbyPlayers?`: `boolean`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:698](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L698)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"removeProgressBar"`` |
| `callback` | (`player`: `Player`, `uid`: `string`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:699](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L699)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"scenario"`` |
| `callback` | (`player`: `Player`, `name`: `string`, `duration`: `number`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:700](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L700)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"setTimeCycleEffect"`` |
| `callback` | (`player`: `Player`, `name`: `RecommendedTimecycleTypes`, `amountInMs`: `number`) => `any`(`player`: `Player`, `name`: `string`, `amountInMs`: `number`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:701](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L701)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"sound2D"`` |
| `callback` | (`player`: `Player`, `audioName`: `string`, `volume?`: `number`, `soundInstantID?`: `string`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:702](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L702)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"sound3D"`` |
| `callback` | (`player`: `Player`, `audioName`: `string`, `target`: `Entity`, `soundInstantID?`: `string`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:703](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L703)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"soundFrontend"`` |
| `callback` | (`player`: `Player`, `audioName`: `string`, `ref`: `string`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:704](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L704)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"soundStop"`` |
| `callback` | (`player`: `Player`, `soundInstantID?`: `string`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:705](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L705)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"startAlarm"`` |
| `callback` | (`player`: `Player`, `name`: `string`) => `void` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:706](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L706)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"stopAlarm"`` |
| `callback` | (`player`: `Player`, `name`: `string`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:707](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L707)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"stopAllAlarms"`` |
| `callback` | (`player`: `Player`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:708](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L708)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"taskTimeline"`` |
| `callback` | (`player`: `Player`, `tasks`: `any`[]) => `any` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:709](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L709)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"tempObjectLerp"`` |
| `callback` | (`player`: `Player`, `model`: `string`, `start`: `IVector3`, `end`: `IVector3`, `speed`: `number`) => `any` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:710](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L710)

▸ **override**(`functionName`, `callback`): `any`

Used to override any internal emit functions.

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"wheelMenu"`` |
| `callback` | (`player`: `Player`, `label`: `string`, `wheelItems`: `IWheelOption`[]) => `any` |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:711](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L711)

___

### particle

▸ **particle**(`player`, `particle`, `emitToNearbyPlayers?`): `void`

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

[server/player/emit.ts:184](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L184)

___

### removeProgressBar

▸ **removeProgressBar**(`player`, `uid`): `any`

Remove a progress bar based on its unique identifier.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `uid` | `string` | A unique string |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:239](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L239)

___

### scenario

▸ **scenario**(`player`, `name`, `duration`): `void`

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

[server/player/emit.ts:139](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L139)

___

### setTimeCycleEffect

▸ **setTimeCycleEffect**(`player`, `name`, `amountInMs`): `any`

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

[server/player/emit.ts:600](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L600)

▸ **setTimeCycleEffect**(`player`, `name`, `amountInMs`): `any`

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

[server/player/emit.ts:601](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L601)

___

### setWeather

▸ **setWeather**(`player`, `weather`, `timeInSeconds`): `void`

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

[server/player/emit.ts:635](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L635)

___

### sound2D

▸ **sound2D**(`player`, `audioName`, `volume?`, `soundInstantID?`): `any`

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

[server/player/emit.ts:254](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L254)

___

### sound3D

▸ **sound3D**(`player`, `audioName`, `target`, `soundInstantID?`): `void`

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

[server/player/emit.ts:269](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L269)

___

### soundFrontend

▸ **soundFrontend**(`player`, `audioName`, `ref`): `void`

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

[server/player/emit.ts:298](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L298)

___

### soundStop

▸ **soundStop**(`player`, `soundInstantID?`): `void`

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

[server/player/emit.ts:284](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L284)

___

### startAlarm

▸ **startAlarm**(`player`, `name`): `void`

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

[server/player/emit.ts:30](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L30)

___

### stopAlarm

▸ **stopAlarm**(`player`, `name`): `any`

Stop an alarm for this player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |
| `name` | `string` |  |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:49](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L49)

___

### stopAllAlarms

▸ **stopAllAlarms**(`player`): `any`

Stop all alarms for this player.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `player` | `Player` | An alt:V Player Entity |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:65](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L65)

___

### taskTimeline

▸ **taskTimeline**(`player`, `tasks`): `any`

Force the player to perform an uncancellable task timeline.

#### Parameters

| Name | Type |
| :------ | :------ |
| `player` | `Player` |
| `tasks` | `any`[] |

#### Returns

`any`

#### Defined in

[server/player/emit.ts:310](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L310)

___

### tempObjectLerp

▸ **tempObjectLerp**(`player`, `model`, `start`, `end`, `speed`): `any`

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

[server/player/emit.ts:518](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L518)

___

### wheelMenu

▸ **wheelMenu**(`player`, `label`, `wheelItems`): `any`

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

[server/player/emit.ts:540](https://github.com/Stuyk/altv-athena/blob/9c488f0/src/core/server/player/emit.ts#L540)
