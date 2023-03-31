---
title: Athena.vehicle.controls
outline: [1,3]
order: 0
---

# {{ $frontmatter.title }}


## Functions

### isLocked

::: tip Usage
Athena.vehicle.controls.**isLocked**(`vehicle`): `boolean`
:::

Returns true if the vehicle is currently locked.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`boolean`

#### Defined in

[server/vehicle/controls.ts:84](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/server/vehicle/controls.ts#L84)

___

### override

::: tip Usage
Athena.vehicle.controls.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle control functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"toggleLock"`` |
| `callback` | (`vehicle`: `Vehicle`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/vehicle/controls.ts:168](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/server/vehicle/controls.ts#L168)

::: tip Usage
Athena.vehicle.controls.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle control functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"toggleDoor"`` |
| `callback` | (`vehicle`: `Vehicle`, `door`: ``0`` \| ``3`` \| ``2`` \| ``1`` \| ``4`` \| ``5``) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/vehicle/controls.ts:169](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/server/vehicle/controls.ts#L169)

::: tip Usage
Athena.vehicle.controls.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle control functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"toggleEngine"`` |
| `callback` | (`vehicle`: `Vehicle`) => `Promise`<`boolean`\> |

#### Returns

`any`

#### Defined in

[server/vehicle/controls.ts:170](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/server/vehicle/controls.ts#L170)

::: tip Usage
Athena.vehicle.controls.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle control functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"update"`` |
| `callback` | (`vehicle`: `Vehicle`) => `any` |

#### Returns

`any`

#### Defined in

[server/vehicle/controls.ts:171](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/server/vehicle/controls.ts#L171)

::: tip Usage
Athena.vehicle.controls.**override**(`functionName`, `callback`): `any`
:::

Used to override vehicle control functionality

#### Parameters

| Name | Type |
| :------ | :------ |
| `functionName` | ``"isLocked"`` |
| `callback` | (`vehicle`: `Vehicle`) => `boolean` |

#### Returns

`any`

#### Defined in

[server/vehicle/controls.ts:172](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/server/vehicle/controls.ts#L172)

___

### toggleDoor

::: tip Usage
Athena.vehicle.controls.**toggleDoor**(`vehicle`, `door`): `Promise`<`boolean`\>
:::

Toggles a vehicle door.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |
| `door` | ``0`` \| ``3`` \| ``2`` \| ``1`` \| ``4`` \| ``5`` |  |

#### Returns

`Promise`<`boolean`\>

The new state of the door. true = open

#### Defined in

[server/vehicle/controls.ts:63](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/server/vehicle/controls.ts#L63)

___

### toggleEngine

::: tip Usage
Athena.vehicle.controls.**toggleEngine**(`vehicle`): `Promise`<`boolean`\>
:::

Toggles a vehicle engine.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`Promise`<`boolean`\>

The new state of the engine. true = on

#### Defined in

[server/vehicle/controls.ts:35](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/server/vehicle/controls.ts#L35)

___

### toggleLock

::: tip Usage
Athena.vehicle.controls.**toggleLock**(`vehicle`): `Promise`<`boolean`\>
:::

Toggles a vehicle door lock.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`Promise`<`boolean`\>

The new state of the lock. true = locked

#### Defined in

[server/vehicle/controls.ts:13](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/server/vehicle/controls.ts#L13)

___

### update

::: tip Usage
Athena.vehicle.controls.**update**(`vehicle`): `any`
:::

Update the given vehicle in the database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `vehicle` | `Vehicle` | An alt:V Vehicle Entity |

#### Returns

`any`

#### Defined in

[server/vehicle/controls.ts:99](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/server/vehicle/controls.ts#L99)

___

### updateLastUsed

::: tip Usage
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

[server/vehicle/controls.ts:149](https://github.com/Stuyk/altv-athena/blob/fe85c1b/src/core/server/vehicle/controls.ts#L149)
