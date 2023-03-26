---
title: Athena.vehicle.controls
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### isLocked

::: Tip
Athena.vehicle.controls.**isLocked**(`vehicle`): `boolean`
:::

Returns true if the vehicle is currently locked.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`boolean`

#### Defined in

[server/vehicle/controls.ts:84](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/controls.ts#L84)

___

### override

::: Tip
Athena.vehicle.controls.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle control functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"toggleLock"`` |
| `callback` | (`vehicle`: `Vehicle`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/vehicle/controls.ts:168](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/controls.ts#L168)

::: Tip
Athena.vehicle.controls.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle control functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"toggleDoor"`` |
| `callback` | (`vehicle`: `Vehicle`, `door`: ``0`` \| ``3`` \| ``2`` \| ``1`` \| ``4`` \| ``5``) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/vehicle/controls.ts:169](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/controls.ts#L169)

::: Tip
Athena.vehicle.controls.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle control functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"toggleEngine"`` |
| `callback` | (`vehicle`: `Vehicle`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/vehicle/controls.ts:170](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/controls.ts#L170)

::: Tip
Athena.vehicle.controls.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle control functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"update"`` |
| `callback` | (`vehicle`: `Vehicle`) => `any` |

#### Returns

`any`

#### Defined in

[server/vehicle/controls.ts:171](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/controls.ts#L171)

::: Tip
Athena.vehicle.controls.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle control functionality

**`Export`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"isLocked"`` |
| `callback` | (`vehicle`: `Vehicle`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/vehicle/controls.ts:172](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/controls.ts#L172)

___

### toggleDoor

::: Tip
Athena.vehicle.controls.**toggleDoor**(`vehicle`, `door`): `Promise`<`boolean`\>
:::

Toggles a vehicle door.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `door` | ``0`` \| ``3`` \| ``2`` \| ``1`` \| ``4`` \| ``5`` |  |

#### Returns

`Promise`<`boolean`\>

The new state of the door. true = open

#### Defined in

[server/vehicle/controls.ts:63](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/controls.ts#L63)

___

### toggleEngine

::: Tip
Athena.vehicle.controls.**toggleEngine**(`vehicle`): `Promise`<`boolean`\>
:::

Toggles a vehicle engine.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`Promise`<`boolean`\>

The new state of the engine. true = on

#### Defined in

[server/vehicle/controls.ts:35](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/controls.ts#L35)

___

### toggleLock

::: Tip
Athena.vehicle.controls.**toggleLock**(`vehicle`): `Promise`<`boolean`\>
:::

Toggles a vehicle door lock.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`Promise`<`boolean`\>

The new state of the lock. true = locked

#### Defined in

[server/vehicle/controls.ts:13](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/controls.ts#L13)

___

### update

::: Tip
Athena.vehicle.controls.**update**(`vehicle`): `any`
:::

Update the given vehicle in the database.

**`Export`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`any`

#### Defined in

[server/vehicle/controls.ts:99](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/controls.ts#L99)

___

### updateLastUsed

::: Tip
Athena.vehicle.controls.**updateLastUsed**(`vehicle`): `Promise`<`void`\>
:::

Update the vehicle's last used value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`Promise`<`void`\>

#### Defined in

[server/vehicle/controls.ts:149](https://github.com/Stuyk/altv-athena/blob/6013452/src/core/server/vehicle/controls.ts#L149)
